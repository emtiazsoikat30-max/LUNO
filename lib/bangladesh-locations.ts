import districtSource from "@/data/bangladesh-districts.source.json";
import upazilaSource from "@/data/bangladesh-upazilas.source.json";

type SourceLocation = {
  id: string;
  name: { en: string; local: string };
  parent?: { id: string };
};

export type BangladeshDistrict = { id: string; en: string; bn: string };
export type BangladeshUpazila = BangladeshDistrict & { districtId: string };

const districtRecords = districtSource as SourceLocation[];
const upazilaRecords = upazilaSource as SourceLocation[];

export const bangladeshDistricts: BangladeshDistrict[] = districtRecords
  .map((district) => ({ id: district.id, en: district.name.en, bn: district.name.local }))
  .sort((a, b) => a.en.localeCompare(b.en));

export const bangladeshUpazilas: BangladeshUpazila[] = upazilaRecords
  .map((upazila) => ({
    id: upazila.id,
    districtId: upazila.parent?.id ?? "",
    en: upazila.name.en,
    bn: upazila.name.local,
  }))
  .filter((upazila) => upazila.districtId)
  .sort((a, b) => a.en.localeCompare(b.en));

export function formatBangladeshLocation(location: { en: string; bn: string }) {
  return `${location.en} (${location.bn})`;
}

export function findDistrict(id: string) {
  return bangladeshDistricts.find((district) => district.id === id);
}

export function findUpazila(id: string, districtId: string) {
  return bangladeshUpazilas.find((upazila) => upazila.id === id && upazila.districtId === districtId);
}
