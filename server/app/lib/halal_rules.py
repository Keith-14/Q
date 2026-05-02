from typing import Literal

HalalStatus = Literal["halal", "doubtful", "haram", "unknown"]

Region = Literal[
    "UK",
    "EU",
    "US",
    "Middle East",
    "South Asia",
    "Southeast Asia",
]


class RegionRules:
    def __init__(
        self,
        certification_bodies: list[str],
        strictness_level: Literal["strict", "moderate", "lenient"],
        vanilla_extract: HalalStatus,
        alcohol_in_flavourings: HalalStatus,
        notes: str,
    ):
        self.certification_bodies = certification_bodies
        self.strictness_level = strictness_level
        self.vanilla_extract = vanilla_extract
        self.alcohol_in_flavourings = alcohol_in_flavourings
        self.notes = notes


REGION_RULES: dict[Region, RegionRules] = {
    "UK": RegionRules(
        certification_bodies=["HFA", "HMC"],
        strictness_level="strict",
        vanilla_extract="doubtful",
        alcohol_in_flavourings="haram",
        notes=(
            "HMC is stricter than HFA on slaughter method (non-stunned only). "
            "E471 requires plant-source certification. "
            "Gelatin must be bovine and halal-certified. "
            "Alcohol in any form including flavourings is generally not accepted."
        ),
    ),
    "EU": RegionRules(
        certification_bodies=["HFCE", "Halal Food Authority EU"],
        strictness_level="moderate",
        vanilla_extract="doubtful",
        alcohol_in_flavourings="doubtful",
        notes=(
            "EU halal market is fragmented with varying certification standards. "
            "No single dominant body. Alcohol traces in flavourings are debated. "
            "French and German communities tend toward stricter interpretation."
        ),
    ),
    "US": RegionRules(
        certification_bodies=["ISNA", "IFANCA", "HFA"],
        strictness_level="moderate",
        vanilla_extract="doubtful",
        alcohol_in_flavourings="doubtful",
        notes=(
            "IFANCA is the most widely trusted certification body. "
            "More lenient than UK/ME on trace alcohol in flavourings. "
            "Many mainstream US products carry IFANCA or ISNA certification."
        ),
    ),
    "Middle East": RegionRules(
        certification_bodies=["ESMA", "SANHA", "IFANCA"],
        strictness_level="strict",
        vanilla_extract="haram",
        alcohol_in_flavourings="haram",
        notes=(
            "Strictest interpretation on alcohol — zero tolerance including traces. "
            "Vanilla extract not accepted due to alcohol content. "
            "GSO (Gulf Standards Organisation) standard applies across GCC. "
            "Animal fats and enzymes require full halal chain verification."
        ),
    ),
    "South Asia": RegionRules(
        certification_bodies=["PSQCA", "BSTI", "Jamiat Ulama"],
        strictness_level="moderate",
        vanilla_extract="doubtful",
        alcohol_in_flavourings="doubtful",
        notes=(
            "Local certification bodies vary significantly by country. "
            "Pakistan: PSQCA. Bangladesh: BSTI. India: Jamiat Ulama-i-Hind. "
            "Imported products should carry a recognised international halal cert. "
            "Consumer awareness of E-numbers is growing but still limited."
        ),
    ),
    "Southeast Asia": RegionRules(
        certification_bodies=["JAKIM", "MUI", "MUIS"],
        strictness_level="moderate",
        vanilla_extract="doubtful",
        alcohol_in_flavourings="doubtful",
        notes=(
            "JAKIM (Malaysia) and MUI (Indonesia) are the most trusted bodies. "
            "MUIS covers Singapore. JAKIM certifies shellac (E904) as halal. "
            "Large Muslim consumer market — many mainstream products carry "
            "JAKIM or MUI certification. Cross-contamination rules strictly enforced."
        ),
    ),
}


def get_region_rules(region: Region) -> RegionRules:
    return REGION_RULES[region]