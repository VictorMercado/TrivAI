"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@components/Combobox";
import { Button } from "@ui/button";
import type { ProfilePicture } from "../page";
import { useLRUCachedFetch } from "@hooks/useLRUCachedFetch";

type PokemonComboBoxProps = {
  value: ProfilePicture;
  setValue: (value: ProfilePicture) => void;
  profilePictures: Array<ProfilePicture>;
};
type ActiveGenType = {
  gen: number;
};

const PokemonComboBox = (props: PokemonComboBoxProps) => {
  const [userProfilePictures, setUserProfilePictures] =
    useState<Array<ProfilePicture>>(props.profilePictures);
  const [activeGen, setActiveGen] = useState<ActiveGenType>({gen: 1});
  const [activePage, setActivePage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const LRUCachedFetch = useLRUCachedFetch(10);

  
  const getNewProfilePicturesClick = async (
    genNumber: number,
    limit: number,
    offset: number,
  ) => {
    // const res = await fetch(
    //   `/api/user/profilePictures?gen=${genNumber}&limit=${limit}&offset=${offset}`,
    // );
    const resultObject = await LRUCachedFetch(
      `/api/user/profilePictures?gen=${genNumber}&limit=${limit}&offset=${offset}`,
    );
    setUserProfilePictures(resultObject.profilePictures);
    setCount(resultObject.count);
  };

  useEffect(() => {
    getNewProfilePicturesClick(1, 100, 0);
  }, []);


  return (
    <Combobox
      value={props.value}
      setValue={props.setValue}
      listItems={userProfilePictures}
    >
      <div className="flex flex-col items-center">
        <div className="grid w-full grid-cols-2 gap-4 p-4 md:grid-cols-4">
          <Button
            className=""
            variant="default"
            size="default"
            onClick={(e) => {
              e.preventDefault();
              getNewProfilePicturesClick(1, 100, 0);
              setActiveGen({gen: 1});
            }}
            active={activeGen.gen === 1}
          >
            Gen 1
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={(e) => {
              e.preventDefault();
              getNewProfilePicturesClick(2, 100, 0);
              setActiveGen({
                gen: 2
              });
            }}
            active={activeGen.gen === 2}
          >
            Gen 2
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={(e) => {
              e.preventDefault();
              getNewProfilePicturesClick(3, 100, 0);
              setActiveGen({gen: 3});
            }}
            active={activeGen.gen === 3}
          >
            Gen 3
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={(e) => {
              e.preventDefault();
              getNewProfilePicturesClick(4, 100, 0);
              setActiveGen({gen: 4});
            }}
            active={activeGen.gen === 4}
          >
            Gen 4
          </Button>
        </div>
        <div className="flex-inline justify-center space-x-2">
          <div>Pages:</div>
          {Array.from(Array(Math.ceil(count / 100)).keys()).map((page) => (
            <Button
              key={page}
              className=""
              variant="default"
              size="default"
              onClick={(e) => {
                e.preventDefault();
                getNewProfilePicturesClick(activeGen.gen, 100, page * 100);
                setActivePage(page + 1);
              }}
              active={activePage === page + 1}
            >
              {page + 1}
            </Button>
          ))}
          
        </div>
      </div>
    </Combobox>
  ); 
}

export { PokemonComboBox };