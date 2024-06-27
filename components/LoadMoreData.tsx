import React from "react";
import { Button } from "./ui/button";
import { Divider } from "./Divider";

interface Props {
  state: any;
  fetchDataFn: any;
}

export const LoadMoreData = ({ state, fetchDataFn }: Props) => {
  if (state == null || state.totalDocs <= state.results.length) {
    return null;
  }

  return (
    <Divider>
      <Button
        onClick={() => fetchDataFn({ page: state.page + 1 })}
        className="bg-trasnparent text-primary"
        variant={'outline'}
      >
        load more
      </Button>
    </Divider>
  );
};
