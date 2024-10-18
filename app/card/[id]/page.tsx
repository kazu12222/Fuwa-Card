"use client";

import React from "react";
import { useParams } from "next/navigation";
import ARScene from "./ARScene";

const Post = () => {
  const params = useParams();
  let pid = params.pid;

  if (typeof pid === "string") {
    pid = pid.replace("/ar", "");
  } else if (Array.isArray(pid)) {
    pid = pid.map((p) => p.replace("/ar", ""))[0];
  }

  return (
    <main>
      <ARScene />
    </main>
  );
};

export default Post;
