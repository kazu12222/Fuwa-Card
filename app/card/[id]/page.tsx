"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import ARScene from "./ARScene";

const Page = () => {
  const params = useParams();
  let pid = params.pid;

  if (typeof pid === "string") {
    pid = pid.replace("/ar", "");
  } else if (Array.isArray(pid)) {
    pid = pid.map((p) => p.replace("/ar", ""))[0];
  }
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="text-center text-2xl">
      <span>AR名刺の中身</span>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogContent className="w-4/5 rounded-lg">
          <DialogHeader>
            <DialogTitle className="m-4 flex justify-center">
              <Image
                src="/card-Image.webp"
                alt={"名刺イメージ"}
                width={182}
                height={110}
              />
            </DialogTitle>
            <DialogDescription className="text-center text-xl font-semibold leading-relaxed">
              目の前の名刺が、
              <br />
              新しい世界への扉を開く。
              <br />
              机の上に置いて、
              <br />
              AR体験を始めましょう。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="mt-4">閉じる</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ARScene />
    </div>

    export default Page;
