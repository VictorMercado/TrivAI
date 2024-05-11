"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/pagination";
import { ItemCard } from "@components/ItemCard";
import { ProfilePictureCard } from "@components/ProfilePictureCard";
import { trpc } from "@t/client";
import { ProfilePicture } from "@trivai/lib/server/queries/profilePicture";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  name: string;
  identifier: string;
  description: string;
  price: number;
  imageUrl: string;
};

type StoreProps = {
  profilePictures: Array<ProfilePicture>;
};

const Store = ({ }) => {
  const [ skip, setSkip ] = useState(0);

  const utils = trpc.useUtils();
  const { data, isLoading, isError } =
    trpc.authViewer.profilePicture.getMore.useQuery({
      take: 30,
      skip: skip,
    });
  const profilePictureCount = trpc.authViewer.profilePicture.count.useQuery();

  const userProfilePictures = trpc.authViewer.user.getProfilePictures.useQuery({});
  return (
    <div className="grid w-full grid-cols-1 gap-10 p-4 md:grid-cols-3">
      {/* <QuizCard quiz={quiz} /> */}
      {/* <QuizCard quiz={quiz} /> */}
      <div>
        <h1 className="text-2xl">Obtained Collection </h1>
        <div className="grid grid-cols-2 pt-10">
          {userProfilePictures?.data?.map(({ profilePicture }, _index) => {
            return (
              <ProfilePictureCard
                key={
                  profilePicture.id + _index + profilePicture.image
                }
                product={profilePicture}
                isBuy={false}
              />
            );
          })}
        </div>
      </div>
      <div className="col-span-2">
        <div className="m-4 flex flex-row justify-center space-x-4">
          <Button
            variant="default"
            size="default"
            onClick={() => {
              if (skip - 30 < 0) {
                return;
              }
              setSkip(skip - 30);
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={() => {
              setSkip(skip + 30);
              utils.authViewer.profilePicture.getMore.invalidate();
            }}
          >
            <ChevronRight />
          </Button>
          {/* <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination> */}
        </div>
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:grid-cols-3">
          {isLoading ? <div>Loading...</div> : null}
          {isError ? <div>Error...</div> : null}
          {data?.map((profilePicture, _index) => {
            return (
              <ProfilePictureCard
                key={
                  profilePicture.id + profilePicture.image
                }
                product={profilePicture}
                isBuy={true}
              />
            );
          })}
          {/* <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} />
          <ItemCard product={charizardProduct} />
          <ItemCard product={RayquezaProduct} /> */}
        </div>
        {/* <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div> */}
      </div>
    </div>
  );
};
export { Store };