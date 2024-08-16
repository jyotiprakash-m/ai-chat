"use client";
import { Button, Input } from "@nextui-org/react";

import { Globe, Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidUrl(website)) {
      setLoading(true);
      router.push(`/${website}`);
    } else {
      console.log("Invalid URL");
    }
  };
  return (
    <main className="flex flex-col justify-center items-center min-h-full ">
      <div className="p-2">
        <div className="flex flex-col items-center">
          <Globe className="size-72" />
          <h3 className="mb-10 text-2xl animate-pulse">
            Enter the website which you want to chat.
          </h3>
        </div>
        <form onSubmit={onSubmit}>
          <Input
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Button type="submit" className="w-full block md:hidden mt-4">
            Submit
          </Button>
        </form>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 flex items-center justify-center">
          <Loader className="size-48 animate-spinner-ease-spin text-zinc-600" />
        </div>
      )}
    </main>
  );
}
