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

