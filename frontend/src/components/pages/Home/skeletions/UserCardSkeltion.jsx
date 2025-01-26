import { Skeleton } from "@mui/material";
import React from "react";

function UserCardSkeltion() {
  return (
    <>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={"100%"}
        height={"70px"}
        sx={{ marginBottom: "2px" }}
      />
    </>
  );
}

export default UserCardSkeltion;
