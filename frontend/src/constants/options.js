export const genderOptions = [
  { label: "Laki-laki", value: "Male" },
  { label: "Perempuan", value: "Female" },
];

export const yesNoOptions = [
  { label: "Ya", value: "yes" },
  { label: "Tidak", value: "no" },
];

export const caecOptions = [
  { label: "Tidak", value: "no" },
  { label: "Kadang-kadang", value: "Sometimes" },
  { label: "Sering", value: "Frequently" },
  { label: "Selalu", value: "Always" },
];

export const calcOptions = [
  { label: "Tidak", value: "no" },
  { label: "Kadang-kadang", value: "Sometimes" },
  { label: "Sering", value: "Frequently" },
  { label: "Selalu", value: "Always" },
];

export const mtransOptions = [
  { label: "Mobil", value: "Automobile" },
  { label: "Motor", value: "Motorbike" },
  { label: "Sepeda", value: "Bike" },
  { label: "Transportasi Umum", value: "Public_Transportation" },
  { label: "Jalan Kaki", value: "Walking" },
];

export const fcvcOptions = [
  { label: "Jarang", value: 1 },
  { label: "Kadang-kadang", value: 2 },
  { label: "Sering", value: 3 },
];

export const ncpOptions = [
  { label: "1 kali", value: 1 },
  { label: "2 kali", value: 2 },
  { label: "3 kali", value: 3 },
  { label: "Lebih dari 3 kali", value: 4 },
];

export const ch2oOptions = [
  { label: "Rendah", value: 1 },
  { label: "Sedang", value: 2 },
  { label: "Tinggi", value: 3 },
];

export const fafOptions = [
  { label: "Tidak pernah", value: 0 },
  { label: "Rendah", value: 1 },
  { label: "Sedang", value: 2 },
  { label: "Tinggi", value: 3 },
];

export const tueOptions = [
  { label: "Rendah", value: 0 },
  { label: "Sedang", value: 1 },
  { label: "Tinggi", value: 2 },
];

export const residentFormOptions = {
  gender: genderOptions,
  family_history_with_overweight: yesNoOptions,
  favc: yesNoOptions,
  fcvc: fcvcOptions,
  ncp: ncpOptions,
  caec: caecOptions,
  smoke: yesNoOptions,
  ch2o: ch2oOptions,
  scc: yesNoOptions,
  faf: fafOptions,
  tue: tueOptions,
  calc: calcOptions,
  mtrans: mtransOptions,
};
