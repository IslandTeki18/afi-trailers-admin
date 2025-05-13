import { Trailer } from "../types/trailer.types";
import { axiosInstance } from "../../../libs/axios";

interface FetchTrailersResponse {
  trailers: Trailer[];
  totalCount: number;
}

export interface FetchTrailersOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

/**
 * Fetches all trailers with optional pagination, sorting and filtering
 * @param options Optional parameters for pagination, sorting and filtering
 * @returns Promise with trailers data and total count
 */
export const fetchTrailers = async (
  options: FetchTrailersOptions = {}
): Promise<FetchTrailersResponse> => {
  const { page = 1, limit = 10, sort, filter } = options;

  try {
    // Build query parameters
    const params: Record<string, any> = {
      page,
      limit,
    };

    if (sort) {
      params.sort = sort;
    }

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[`filter[${key}]`] = value;
        }
      });
    }

    // Make API request using axios instance
    const response = await axiosInstance.get("/trailers", { params });

    return {
      trailers: response.data.trailers || [],
      totalCount: response.data.totalCount || 0,
    };
  } catch (error) {
    console.error("Failed to fetch trailers:", error);
    throw error;
  }
};
