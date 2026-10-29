from fastapi import APIRouter, HTTPException, Path
from app.core.inventory import InventoryService

router = APIRouter(prefix="/api/inventory", tags=["Inventory & QR Resolver"])
inventory_service = InventoryService()


@router.get("/scan/{qr_id}")
async def resolve_qr_code(qr_id: str = Path(..., description="Scanned QR code ID or asset code")):
    """
    Resolves scanned QR code into device or classroom inventory data.
    Directly connects classrooms.csv and device_inventory.csv.
    """
    result = inventory_service.resolve_qr(qr_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"QR Code or Asset ID '{qr_id}' not found in campus inventory."
        )
    return result


@router.get("/classrooms")
async def list_classrooms():
    """Returns all campus classrooms."""
    return inventory_service.list_classrooms()


@router.get("/devices")
async def list_devices():
    """Returns all registered AV devices."""
    return inventory_service.list_devices()


@router.get("/classroom/{classroom_id}/devices")
async def get_classroom_devices(classroom_id: str):
    """Returns all devices located inside a specific classroom."""
    devices = inventory_service.get_classroom_devices(classroom_id)
    return devices

