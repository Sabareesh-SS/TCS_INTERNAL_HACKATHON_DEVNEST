import os
import httpx
import pandas as pd
from pathlib import Path
from app.config import settings


def main():
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    if not url or not key:
        print("[ERROR] SUPABASE_URL or SUPABASE_KEY not set in .env")
        return

    base_dir = Path(__file__).resolve().parent.parent
    data_dir = os.path.join(base_dir, "data")

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    client = httpx.Client(timeout=15.0)

    # 1. Seed Classrooms
    cls_path = os.path.join(data_dir, "classrooms.csv")
    if os.path.exists(cls_path):
        cls_df = pd.read_csv(cls_path).fillna("")
        cls_df.columns = cls_df.columns.str.strip()
        records = cls_df.to_dict(orient="records")
        res = client.post(f"{url}/rest/v1/classrooms", json=records, headers=headers)
        if res.status_code in [200, 201]:
            print(f"[OK] Seeded {len(records)} classrooms into Supabase")
        else:
            print(f"[WARN] Classrooms seed failed ({res.status_code}): {res.text}")

    # 2. Seed Device Inventory
    dev_path = os.path.join(data_dir, "device_inventory.csv")
    if os.path.exists(dev_path):
        dev_df = pd.read_csv(dev_path).fillna("")
        dev_df.columns = dev_df.columns.str.strip()
        records = dev_df.to_dict(orient="records")
        res = client.post(f"{url}/rest/v1/device_inventory", json=records, headers=headers)
        if res.status_code in [200, 201]:
            print(f"[OK] Seeded {len(records)} devices into Supabase")
        else:
            print(f"[WARN] Device inventory seed failed ({res.status_code}): {res.text}")

    # 3. Seed Incidents (first 50 for initial database population)
    inc_path = os.path.join(data_dir, "av_incidents.csv")
    if os.path.exists(inc_path):
        inc_df = pd.read_csv(inc_path).fillna("")
        inc_df.columns = inc_df.columns.str.strip()
        records = inc_df.head(50).to_dict(orient="records")
        res = client.post(f"{url}/rest/v1/av_incidents", json=records, headers=headers)
        if res.status_code in [200, 201]:
            print(f"[OK] Seeded {len(records)} incidents into Supabase")
        else:
            print(f"[WARN] Incidents seed failed ({res.status_code}): {res.text}")

    client.close()


if __name__ == "__main__":
    main()
