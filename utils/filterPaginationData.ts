import axios from "axios";

interface PaginationParams {
  create_new_array?: boolean;
  state: State | null;
  data: any[];
  page: number;
  count: string;
  data_to_send: any;
}

interface State {
  results: any[];
  page?: number;
  totalDocs?: number;
}

export const filterPaginationData = async ({
  create_new_array = false,
  state,
  data,
  page,
  count,
  data_to_send,
}: PaginationParams): Promise<any> => {
  try {
    if (state && !create_new_array) {
      // Append new data to existing results
      const updatedResults = [...state.results, ...data];
      const updatedState = { ...state, results: updatedResults, page };
      return updatedState;
    } else {
      // Fetch total document count and create new state
      const response = await axios.post(count, data_to_send);
      const { totalDocs } = response.data;

      const newState = {
        results: data,
        page: 1,
        totalDocs,
      };

      return newState;
    }
  } catch (error) {
    throw error;
  }
};
