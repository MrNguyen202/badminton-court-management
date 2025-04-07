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

export function WardSelector({
  district,
  onWardChange,
}: {
  district: { name: string | null; code: number | null }; // Nhận cả name và code
  onWardChange: (name: string | null) => void;
}) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (district?.code) {
      setLoading(true);
      const fetchWards = async () => {
        try {
          const response = await locationApi.getWardByDistrictCode(district.code as number);
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
  }, [district?.code]);

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      <select
        name="ward"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => {
          const selectedName = e.target.value.trim();
          onWardChange(selectedName || null);
        }}
        required
      >
        <option value="">-- Phường/Xã --</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.name}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DistrictSelector({
  provinceName,
  onDistrictChange,
}: {
  provinceName: string | null;
  onDistrictChange: (district: { name: string | null; code: number | null }) => void; // Thay đổi để truyền cả name và code
}) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (provinceName) {
      setLoading(true);
      const fetchDistricts = async () => {
        try {
          const provinces = await locationApi.getAllProvince();
          const province = provinces.find((p: { name: string; }) => p.name === provinceName);
          const provinceCode = province?.code;

          if (provinceCode) {
            const response = await locationApi.getDistrictByProvinceCode(provinceCode);
            const districtsData = Array.isArray(response.districts) ? response.districts : [];
            setDistricts(districtsData);
          }
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
  }, [provinceName]);

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-4">
      <select
        name="district"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => {
          const selectedName = e.target.value.trim();
          const selectedDistrict = districts.find((d) => d.name === selectedName);
          onDistrictChange({
            name: selectedName || null,
            code: selectedDistrict ? selectedDistrict.code : null,
          });
        }}
        required
      >
        <option value="">-- Quận/Huyện --</option>
        {districts.map((district) => (
          <option key={district.code} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ProvinceSelector({
  onProvinceChange,
}: {
  onProvinceChange: (name: string | null) => void;
}) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await locationApi.getAllProvince();
        const provincesData = Array.isArray(response) ? response : [];
        setProvinces(provincesData);
      } catch {
        setError("Không thể tải danh sách tỉnh/thành. Vui lòng thử lại.");
      } finally {
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
        onChange={(e) => {
          const selectedName = e.target.value.trim();
          onProvinceChange(selectedName || null);
        }}
        required
      >
        <option value="">-- Tỉnh/Thành phố --</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>
    </div>
  );
}