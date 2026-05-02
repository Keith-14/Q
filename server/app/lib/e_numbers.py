from typing import Optional
from app.lib.halal_rules import Region, HalalStatus
import re


class ENumberEntry:
    def __init__(
        self,
        code: str,
        name: str,
        source: str,
        default_status: HalalStatus,
        region_overrides: dict[Region, HalalStatus],
        notes: str,
    ):
        self.code = code
        self.name = name
        self.source = source
        self.default_status = default_status
        self.region_overrides = region_overrides
        self.notes = notes


E_NUMBERS: list[ENumberEntry] = [
    ENumberEntry("E120",  "Carmine / Cochineal",                    "Insect-derived",              "haram",     {},                                      "Always haram — derived from crushed cochineal insects."),
    ENumberEntry("E441",  "Gelatine",                               "Pork or animal bones",        "haram",     {},                                      "Haram unless explicitly halal-certified bovine source."),
    ENumberEntry("E542",  "Bone phosphate",                         "Animal bone",                 "haram",     {},                                      "Derived from animal bones — always haram."),
    ENumberEntry("E422",  "Glycerol",                               "Animal or plant",             "doubtful",  {},                                      "Halal if plant-derived. Haram if from pork fat. Source must be verified."),
    ENumberEntry("E471",  "Mono and diglycerides of fatty acids",   "Animal or plant",             "doubtful",  {},                                      "Very common emulsifier. Halal if from plant oils, haram if from animal fat."),
    ENumberEntry("E472a", "Acetic acid esters of mono/diglycerides","Animal or plant",             "doubtful",  {},                                      "Same concern as E471 — source must be confirmed."),
    ENumberEntry("E472b", "Lactic acid esters of mono/diglycerides","Animal or plant",             "doubtful",  {},                                      "Same concern as E471 — source must be confirmed."),
    ENumberEntry("E472e", "Mono and diacetyl tartaric acid esters", "Animal or plant",             "doubtful",  {},                                      "Same concern as E471 — source must be confirmed."),
    ENumberEntry("E481",  "Sodium stearoyl lactylate",              "Animal or plant",             "doubtful",  {},                                      "Can be derived from animal fats. Look for plant-sourced certification."),
    ENumberEntry("E904",  "Shellac",                                "Insect resin",                "doubtful",  {"Southeast Asia": "halal"},             "Secreted by lac insects. Halal per JAKIM (Malaysia). Doubtful elsewhere."),
    ENumberEntry("E920",  "L-Cysteine",                             "Often hog hair or feathers",  "doubtful",  {},                                      "Frequently sourced from hog hair. Halal if from human hair or fermentation."),
    ENumberEntry("E322",  "Lecithin",                               "Soy, sunflower, or egg",      "halal",     {},                                      "Halal when from soy or sunflower. Verify if labelled as 'animal lecithin'."),
    ENumberEntry("E1105", "Lysozyme",                               "Egg white",                   "halal",     {},                                      "Derived from egg whites — halal."),
    ENumberEntry("E621",  "Monosodium glutamate (MSG)",             "Fermentation",                "halal",     {},                                      "Produced by fermentation of sugars — halal."),
    ENumberEntry("E102",  "Tartrazine",                             "Synthetic",                   "halal",     {},                                      "Synthetic yellow dye — halal."),
    ENumberEntry("E110",  "Sunset yellow FCF",                      "Synthetic",                   "halal",     {},                                      "Synthetic orange-yellow dye — halal."),
    ENumberEntry("E122",  "Carmoisine",                             "Synthetic",                   "halal",     {},                                      "Synthetic red dye — halal."),
    ENumberEntry("E124",  "Ponceau 4R",                             "Synthetic",                   "halal",     {},                                      "Synthetic red dye — halal."),
    ENumberEntry("E129",  "Allura red AC",                          "Synthetic",                   "halal",     {},                                      "Synthetic red dye — halal."),
    ENumberEntry("E133",  "Brilliant blue FCF",                     "Synthetic",                   "halal",     {},                                      "Synthetic blue dye — halal."),
    ENumberEntry("E142",  "Green S",                                "Synthetic",                   "halal",     {},                                      "Synthetic green dye — halal."),
    ENumberEntry("E150d", "Caramel colour (sulphite ammonia)",      "Sugar-derived",               "halal",     {},                                      "Made from sugar — halal. Used in cola drinks."),
    ENumberEntry("E160a", "Beta-carotene",                          "Plant or synthetic",          "halal",     {},                                      "Usually from plant sources or synthetic — halal."),
    ENumberEntry("E270",  "Lactic acid",                            "Fermentation or dairy",       "halal",     {},                                      "Produced by fermentation — halal."),
    ENumberEntry("E300",  "Ascorbic acid (Vitamin C)",              "Synthetic or plant",          "halal",     {},                                      "Synthetic or plant-derived — always halal."),
    ENumberEntry("E330",  "Citric acid",                            "Fermentation of sugars",      "halal",     {},                                      "Produced by fermentation — halal."),
    ENumberEntry("E331",  "Sodium citrates",                        "Citric acid derivative",      "halal",     {},                                      "Derived from citric acid — halal."),
    ENumberEntry("E500",  "Sodium carbonates",                      "Mineral",                     "halal",     {},                                      "Mineral origin — halal."),
    ENumberEntry("E170",  "Calcium carbonate",                      "Mineral",                     "halal",     {},                                      "Mineral origin — halal."),
    ENumberEntry("E252",  "Potassium nitrate",                      "Mineral",                     "halal",     {},                                      "Mineral origin — halal. Used as preservative."),
    ENumberEntry("E407",  "Carrageenan",                            "Seaweed",                     "halal",     {},                                      "Extracted from red seaweed — halal."),
    ENumberEntry("E410",  "Locust bean gum",                        "Plant (carob seeds)",         "halal",     {},                                      "From carob plant seeds — halal."),
    ENumberEntry("E412",  "Guar gum",                               "Plant",                       "halal",     {},                                      "From guar plant — halal."),
    ENumberEntry("E415",  "Xanthan gum",                            "Fermentation",                "halal",     {},                                      "Produced by bacterial fermentation — halal."),
    ENumberEntry("E440",  "Pectins",                                "Plant (fruit)",               "halal",     {},                                      "Extracted from fruit peels — halal."),
    ENumberEntry("E1400", "Dextrins",                               "Starch",                      "halal",     {},                                      "Derived from starch — halal."),
    ENumberEntry("E160b", "Annatto / Bixin",                        "Plant (annatto seeds)",       "halal",     {},                                      "Natural plant-derived colour — halal."),
]


def lookup_e_number(code: str) -> Optional[ENumberEntry]:
    normalised = code.upper().strip()
    return next((e for e in E_NUMBERS if e.code == normalised), None)


def extract_e_codes(text: str) -> list[str]:
    return list(set(re.findall(r'E\d{3,4}[a-z]?', text, re.IGNORECASE)))


def get_status_for_region(entry: ENumberEntry, region: Region) -> HalalStatus:
    return entry.region_overrides.get(region, entry.default_status)


def build_e_number_summary(ingredients: str, region: Region) -> str:
    codes = extract_e_codes(ingredients)
    if not codes:
        return "None detected"

    lines = []
    for code in sorted(codes):
        entry = lookup_e_number(code)
        if entry:
            status = get_status_for_region(entry, region)
            lines.append(f"{entry.code} ({entry.name} — {status.upper()}): {entry.notes}")
        else:
            lines.append(f"{code.upper()} — not in local database, Gemini should assess")

    return "\n".join(lines)