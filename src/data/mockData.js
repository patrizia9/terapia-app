export const MOCK_USERS = [
  {
    id: 1,
    name: "Mario Rossi",
    email: "mario@example.com",
    password: "1234",
    dob: "1965-03-12",
  },
];

export const MOCK_DRUGS = [
  {
    id: 1,
    name: "Metformina",
    dosage: "500mg",
    times: ["08:00", "20:00"],
    totalPills: 60,
    remainingPills: 23,
    startDate: "2024-11-01",
    durationDays: 90,
    taken: [],
  },
  {
    id: 2,
    name: "Ramipril",
    dosage: "5mg",
    times: ["08:00"],
    totalPills: 30,
    remainingPills: 8,
    startDate: "2024-12-01",
    durationDays: 30,
    taken: [],
  },
  {
    id: 3,
    name: "Atorvastatina",
    dosage: "20mg",
    times: ["21:00"],
    totalPills: 30,
    remainingPills: 19,
    startDate: "2024-12-15",
    durationDays: 30,
    taken: [],
  },
];

export const MOCK_DOCTOR = {
  name: "",
  specialty: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export const CHART_COLORS = [
  "#2D6A4F","#E76F51","#E9C46A",
  "#457B9D","#A8DADC","#E63946"
];