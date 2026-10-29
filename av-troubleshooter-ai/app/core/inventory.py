import os
import pandas as pd
from typing import Optional, Dict, Any, List
from pathlib import Path


class InventoryService:
    """
    Resolves QR codes from classrooms.csv and device_inventory.csv.
    Enables Sabareesh's mobile app to scan either classroom or device QR codes
    and immediately obtain full hardware and location telemetry.
    """

    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            data_dir = os.path.join(base_dir, "data")

        self.classrooms_path = os.path.join(data_dir, "classrooms.csv")
        self.devices_path = os.path.join(data_dir, "device_inventory.csv")

        self.classrooms_df = pd.DataFrame()
        self.devices_df = pd.DataFrame()
        self.load_inventory()

    def load_inventory(self):
        if os.path.exists(self.classrooms_path):
            self.classrooms_df = pd.read_csv(self.classrooms_path).fillna("")
            self.classrooms_df.columns = self.classrooms_df.columns.str.strip()

        if os.path.exists(self.devices_path):
            self.devices_df = pd.read_csv(self.devices_path).fillna("")
            self.devices_df.columns = self.devices_df.columns.str.strip()

    def resolve_qr(self, qr_code_or_id: str) -> Optional[Dict[str, Any]]:
        """
        Resolves a scanned QR code (classroom or device) or asset/device ID.
        """
        code = qr_code_or_id.strip()

        # 1. Check if it matches a Device QR or device_id
        if not self.devices_df.empty:
            dev_match = (
                (self.devices_df["device_qr_id"] == code) |
                (self.devices_df["device_id"] == code) |
                (self.devices_df["asset_id"] == code)
            )
            if dev_match.any():
                dev_row = self.devices_df[dev_match].iloc[0].to_dict()
                # Find matching classroom
                cls_info = {}
                if not self.classrooms_df.empty:
                    c_match = self.classrooms_df["classroom_id"] == dev_row.get("classroom_id")
                    if c_match.any():
                        cls_info = self.classrooms_df[c_match].iloc[0].to_dict()

                return {
                    "entry_type": "DEVICE_QR",
                    "device": dev_row,
                    "classroom": cls_info
                }

        # 2. Check if it matches a Classroom QR or classroom_id / room_no
        if not self.classrooms_df.empty:
            cls_match = (
                (self.classrooms_df["classroom_qr_id"] == code) |
                (self.classrooms_df["classroom_id"] == code) |
                (self.classrooms_df["room_no"] == code)
            )
            if cls_match.any():
                cls_row = self.classrooms_df[cls_match].iloc[0].to_dict()
                # Find all devices in this classroom
                room_devices = []
                if not self.devices_df.empty:
                    d_match = self.devices_df["classroom_id"] == cls_row.get("classroom_id")
                    if d_match.any():
                        room_devices = self.devices_df[d_match].to_dict(orient="records")

                return {
                    "entry_type": "CLASSROOM_QR",
                    "classroom": cls_row,
                    "devices": room_devices
                }

        return None

