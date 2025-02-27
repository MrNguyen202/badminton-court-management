import React, { useEffect, useState } from "react";
import { locationApi } from "../../api/location/locationAPI";

type Ward = {
  code: number;
  name: string;
  division_type: string;
  district_code: number;
  codename: string;
};

type District = {
  code: number;
  name: string;
  division_type: string;
  province_code: number;
  codename: string;
};

type Province = {
  name: string;
  code: number;
  division_type: string;
  phone_code: number;
  codename: string;
};

// WardSelector
export function WardSelector({
  districtCode,
  onWardChange,
}: {
  districtCode: number | null;
  onWardChange: (code: number | null) => void;
}) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (districtCode) {
      setLoading(true);
      const fetchWards = async () => {
        try {
          const response = await locationApi.getWardByDistrictCode(districtCode);
          // API trả về object với thuộc tính wards
          const wardsData = Array.isArray(response.wards) ? response.wards : [];
          setWards(wardsData);
          setLoading(false);
        } catch (err) {
          setError("Không thể tải danh sách phường/xã. Vui lòng thử lại.");
          setWards([]);
          setLoading(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [districtCode]);

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      <select
        name="ward"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => onWardChange(e.target.value ? parseInt(e.target.value, 10) : null)}
        required
      >
        <option value="">-- Phường/Xã --</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.code}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// DistrictSelector
export function DistrictSelector({
  provinceCode,
  onDistrictChange,
}: {
  provinceCode: number | null;
  onDistrictChange: (code: number | null) => void;
}) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (provinceCode) {
      setLoading(true);
      const fetchDistricts = async () => {
        try {
          const response = await locationApi.getDistrictByProvinceCode(provinceCode);
          // API trả về object với thuộc tính districts
          const districtsData = Array.isArray(response.districts) ? response.districts : [];
          setDistricts(districtsData);
          setLoading(false);
        } catch (err) {
          setError("Không thể tải danh sách quận/huyện. Vui lòng thử lại.");
          setDistricts([]);
          setLoading(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [provinceCode]);

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      <select
        name="district"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => onDistrictChange(e.target.value ? parseInt(e.target.value, 10) : null)}
        required
      >
        <option value="">-- Quận/Huyện --</option>
        {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ProvinceSelector
export function ProvinceSelector({
  onProvinceChange,
}: {
  onProvinceChange: (code: number | null) => void;
}) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await locationApi.getAllProvince();
        // API trả về mảng trực tiếp
        const provincesData = Array.isArray(response) ? response : [];
        setProvinces(provincesData);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách tỉnh/thành. Vui lòng thử lại.");
        setProvinces([]);
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      <select
        name="province"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => onProvinceChange(e.target.value ? parseInt(e.target.value, 10) : null)}
        required
      >
        <option value="">-- Tỉnh/Thành phố --</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>
    </div>
  );
}