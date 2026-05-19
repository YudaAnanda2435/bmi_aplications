def normalize_height_to_meter(height: float) -> float:
    if height <= 0:
        raise ValueError("Height must be greater than 0")
    if height > 3:
        return height / 100
    return height


def calculate_bmi(height: float, weight: float) -> float:
    if weight <= 0:
        raise ValueError("Weight must be greater than 0")
    height_in_meter = normalize_height_to_meter(height)
    return weight / (height_in_meter**2)
