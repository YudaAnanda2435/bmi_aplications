import {
  BarChart3,
  MessageSquare,
  UsersRound,
  Zap,
} from "lucide-react";

export const features = [
  {
    title: "Data Penduduk",
    description:
      "Pencatatan data riwayat kesehatan, tinggi, dan berat badan penduduk secara terpusat.",
    icon: UsersRound,
    shape: "rounded-[43%_57%_70%_30%/30%_30%_70%_70%] bg-yellow-200",
    iconClass: "text-yellow-600",
  },
  {
    title: "Klasifikasi Otomatis",
    description:
      "Menghitung BMI dan status obesitas menggunakan algoritma Naive Bayes.",
    icon: BarChart3,
    shape: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-purple-200",
    iconClass: "text-purple-600",
  },
  {
    title: "Rekomendasi Diet",
    description:
      "Sistem menampilkan rekomendasi pola diet berdasarkan hasil klasifikasi.",
    icon: MessageSquare,
    shape: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-orange-200",
    iconClass: "text-orange-600",
  },
  {
    title: "Peringatan Dini",
    description:
      "Memberikan indikasi awal untuk kelompok masyarakat yang perlu dipantau.",
    icon: Zap,
    shape: "rounded-[43%_57%_70%_30%/30%_30%_70%_70%] bg-green-200",
    iconClass: "text-green-600",
  },
];

export const steps = [
  {
    title: "Masuk Pengguna",
    description: "Login ke dashboard sistem melalui halaman masuk terpusat.",
  },
  {
    title: "Input Data",
    description: "Masukkan data penduduk sesuai atribut yang dibutuhkan.",
  },
  {
    title: "Proses Sistem",
    description: "Backend menghitung BMI dan memproses Naive Bayes.",
  },
  {
    title: "Tampil Hasil",
    description: "Lihat status klasifikasi, rekomendasi, dan peringatan.",
  },
];

export const categories = [
  {
    title: "Normal",
    description: "Berat badan ideal proporsional dengan tinggi badan.",
    wrapper: "border-green-100 bg-green-50/50 hover:bg-green-50",
    dot: "bg-green-500",
  },
  {
    title: "Underweight",
    description: "Berat badan di bawah standar ideal proporsional.",
    wrapper: "border-yellow-100 bg-yellow-50/50 hover:bg-yellow-50",
    dot: "bg-yellow-400",
  },
  {
    title: "Overweight",
    description: "Kelebihan berat badan tingkat awal sebelum obesitas.",
    wrapper: "border-orange-100 bg-orange-50/50 hover:bg-orange-50",
    dot: "bg-orange-500",
  },
  {
    title: "Obesity",
    description: "Kelebihan berat badan signifikan dan perlu perhatian.",
    wrapper: "border-red-100 bg-red-50/50 hover:bg-red-50",
    dot: "bg-red-500",
  },
];
