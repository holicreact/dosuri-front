import {
  GetUserAuthParams,
  GetUserAuthResponse,
  IGetDoctorList,
  IGetHospitalInfo,
  IGetHospitalListParams,
  IHospitalTreatmentsResponse,
  IToggleHospitalThumbup,
} from "./types";

import { IHospitalInfoResponse } from "@/mock/hospitals";
import api from "./axiosConfig";

export const getUserAuth = async (params: GetUserAuthParams) => {
  const response = await api.get<GetUserAuthResponse>("/user/v1/auth", {
    params: {
      token: params.token,
      type: params.type,
    },
  });
  return response.data;
};

export const getHospitalList = async (params?: IGetHospitalListParams) => {
  const response = await api.get<IHospitalInfoResponse>(
    "/hospital/v1/hospitals",
    {
      params,
    }
  );
  return response.data;
};

export const getHospitalInfo = async (uuid: string) => {
  const response = await api.get<IGetHospitalInfo>(
    `hospital/v1/hospitals/${uuid}`
  );
  return response.data;
};

export const getHospitalTreatments = async (uuid: string) => {
  const response = await api.get<IHospitalTreatmentsResponse>(
    "/hospital/v1/hospital-treatments",
    {
      params: {
        hospital: uuid,
      },
    }
  );
  return response.data;
};

export const getDoctorList = async (uuid: string) => {
  const response = await api.get<IGetDoctorList>("/hospital/v1/doctors", {
    params: {
      hospital: uuid,
    },
  });
  return response.data;
};

export const toggleHospitalThumbup = async (data: { hospital?: string }) => {
  const response = await api.post<IToggleHospitalThumbup>(
    "/hospital/v1/hospital-user-assocs",
    data
  );

  return response.data;
};