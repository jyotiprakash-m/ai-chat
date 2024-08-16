import ChatWrapper from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import React from "react";
interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}
function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponent = url.map((component) =>
    decodeURIComponent(component)
  );
  return decodedComponent.join("/");
}
const Page = async ({ params }: PageProps) => {
  console.log(params);

  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrl
  );
  //   console.log(isAlreadyIndexed);
  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(
    /\//g,
    ""
  );
  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId,
  });
  console.log(initialMessages);
  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });
    await redis.sadd("indexed-urls", reconstructedUrl);
  }
  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  );
};

export default Page;
