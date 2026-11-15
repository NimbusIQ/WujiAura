
export interface TCMPoint {
  id: string;
  name: string;
  meridian: string;
  element: string;
  category: string[];
  location: string;
  functions: string[];
  indications: string[];
}

export const TCM_POINTS: TCMPoint[] = [
  {
    id: "LU1",
    name: "Zhongfu",
    meridian: "LU",
    element: "Metal",
    category: ["Front-Mu"],
    location: "Lateral aspect of chest",
    functions: ["Disseminate Lung Qi", "Stop cough"],
    indications: ["Cough", "Asthma", "Chest pain"]
  },
  {
    id: "LU7",
    name: "Lieque",
    meridian: "LU",
    element: "Metal",
    category: ["Luo-connecting", "Confluent"],
    location: "Radial side of forearm",
    functions: ["Release exterior", "Expel wind", "Benefit head and neck"],
    indications: ["Headache", "Stiff neck", "Cough"]
  },
  {
    id: "LU9",
    name: "Taiyuan",
    meridian: "LU",
    element: "Earth",
    category: ["Shu-Stream", "Yuan-Source", "Mother Point"],
    location: "Radial side of wrist crease",
    functions: ["Tonify Lung Qi", "Nourish Lung Yin"],
    indications: ["Cough", "Asthma", "Sore throat"]
  },
  {
    id: "LI4",
    name: "Hegu",
    meridian: "LI",
    element: "Metal",
    category: ["Yuan-Source", "Command"],
    location: "Between 1st and 2nd metacarpals",
    functions: ["Expel wind", "Regulate Face and Mouth", "Alleviate pain"],
    indications: ["Headache", "Toothache", "Facial paralysis", "Fever"]
  },
  {
    id: "LI11",
    name: "Quchi",
    meridian: "LI",
    element: "Earth",
    category: ["He-Sea", "Ghos Point"],
    location: "Lateral end of elbow crease",
    functions: ["Clear heat", "Cool blood", "Regulate Qi"],
    indications: ["Fever", "Sore throat", "Skin rash", "Abdominal pain"]
  },
  {
    id: "ST36",
    name: "Zusanli",
    meridian: "ST",
    element: "Earth",
    category: ["He-Sea", "Command", "Lower He-Sea"],
    location: "Below knee, lateral to tibia",
    functions: ["Tonify Qi and Blood", "Harmonize Stomach", "Strengthen Body"],
    indications: ["Fatigue", "Weak digestion", "Leg pain", "Immune boost"]
  },
  {
    id: "ST44",
    name: "Neiting",
    meridian: "ST",
    element: "Water",
    category: ["Ying-Spring"],
    location: "Between 2nd and 3rd toes",
    functions: ["Clear Stomach Heat", "Resolve dampness"],
    indications: ["Toothache", "Sore throat", "Acid reflux", "Nosebleed"]
  },
  {
    id: "SP6",
    name: "Sanyinjiao",
    meridian: "SP",
    element: "Earth",
    category: ["Intersection"],
    location: "Above medial malleolus",
    functions: ["Tonify Spleen and Stomach", "Harmonize Liver and Kidney", "Regulate Menstruation"],
    indications: ["Digestive issues", "Insomnia", "Urinary disorders", "Gynecological issues"]
  },
  {
    id: "HT7",
    name: "Shenmen",
    meridian: "HT",
    element: "Earth",
    category: ["Shu-Stream", "Yuan-Source", "Son Point"],
    location: "Ulnar side of wrist crease",
    functions: ["Calm Heart Shen", "Regulate Heart Qi"],
    indications: ["Anxiety", "Insomnia", "Palpitations", "Memory loss"]
  },
  {
    id: "SI3",
    name: "Houxi",
    meridian: "SI",
    element: "Wood",
    category: ["Shu-Stream", "Confluent"],
    location: "Ulnar side of hand, near 5th MCP joint",
    functions: ["Benefit neck and back", "Clear heat", "Calm Shen"],
    indications: ["Neck stiffness", "Back pain", "Night sweats", "Tinnitus"]
  },
  {
    id: "BL40",
    name: "Weizhong",
    meridian: "BL",
    element: "Earth",
    category: ["He-Sea", "Command"],
    location: "Popliteal crease center",
    functions: ["Benefit back and knees", "Clear heat", "Cool blood"],
    indications: ["Lower back pain", "Sciatica", "Knee pain", "Skin heat"]
  },
  {
    id: "KI3",
    name: "Taixi",
    meridian: "KI",
    element: "Earth",
    category: ["Shu-Stream", "Yuan-Source"],
    location: "Behind medial malleolus",
    functions: ["Tonify Kidney Yin and Yang", "Strengthen back"],
    indications: ["Low back pain", "Dizziness", "Tinnitus", "Sore throat"]
  },
  {
    id: "PC6",
    name: "Neiguan",
    meridian: "PC",
    element: "Fire",
    category: ["Luo-connecting", "Confluent"],
    location: "Above wrist crease, between tendons",
    functions: ["Harmonize Heart", "Regulate Qi", "Alleviate nausea"],
    indications: ["Nausea", "Anxiety", "Chest tightness", "Insomnia"]
  },
  {
    id: "SJ5",
    name: "Waiguan",
    meridian: "SJ",
    element: "Fire",
    category: ["Luo-connecting", "Confluent"],
    location: "Above wrist crease, lateral side",
    functions: ["Expel wind", "Clear heat", "Benefit ears"],
    indications: ["Fever", "Headache", "Earache", "Wrist pain"]
  },
  {
    id: "GB20",
    name: "Fengchi",
    meridian: "GB",
    element: "Wood",
    category: ["Intersection"],
    location: "Below occiput",
    functions: ["Expel wind", "Benefit head and eyes", "Regulate Qi"],
    indications: ["Headache", "Dizziness", "Stiff neck", "Common cold"]
  },
  {
    id: "GB34",
    name: "Yanglingquan",
    meridian: "GB",
    element: "Earth",
    category: ["He-Sea", "Hui-Meeting of Sinews"],
    location: "Below head of fibula",
    functions: ["Benefit sinews", "Spread Liver Qi"],
    indications: ["Muscle cramps", "Joint pain", "Gallbladder issues", "Sciatica"]
  },
  {
    id: "LR3",
    name: "Taichong",
    meridian: "LR",
    element: "Earth",
    category: ["Shu-Stream", "Yuan-Source"],
    location: "Between 1st and 2nd metatarsals",
    functions: ["Pacify Liver", "Regulate Qi and Blood", "Clear head"],
    indications: ["Headache", "Hypertension", "Anger", "Eye issues"]
  },
  {
    id: "GV20",
    name: "Baihui",
    meridian: "GV",
    element: "Fire",
    category: ["Intersection"],
    location: "Vertex of head",
    functions: ["Raise Yang Qi", "Calm Shen", "Pacify Wind"],
    indications: ["Headache", "Dizziness", "Prolapse", "Mental fog"]
  },
  {
    id: "CV12",
    name: "Zhongwan",
    meridian: "CV",
    element: "Earth",
    category: ["Front-Mu of ST", "Hui-Meeting of Fu"],
    location: "Upper abdomen",
    functions: ["Harmonize Middle Jiao", "Tonify Spleen", "Regulate Qi"],
    indications: ["Stomach ache", "Bloating", "Nausea", "Diarrhea"]
  }
];

export const MERIDIAN_FLOW = [
  "LU", "LI", "ST", "SP", "HT", "SI", "BL", "KI", "PC", "SJ", "GB", "LR"
];

export const MERIDIAN_COUPLES: Record<string, string> = {
  "LU": "LI",
  "LI": "LU",
  "ST": "SP",
  "SP": "ST",
  "HT": "SI",
  "SI": "HT",
  "BL": "KI",
  "KI": "BL",
  "PC": "SJ",
  "SJ": "PC",
  "GB": "LR",
  "LR": "GB"
};
