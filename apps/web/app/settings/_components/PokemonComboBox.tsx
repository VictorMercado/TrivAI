"use client";
import { trpc } from "@t/client";
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

const PokemonComboBox = ({ value , setValue, profilePictures}: PokemonComboBoxProps) => {
  // const [userProfilePictures, setUserProfilePictures] = useState<
  //   Array<ProfilePicture>
  // >(props.profilePictures);
  const [activeGen, setActiveGen] = useState<ActiveGenType>({ gen: 1 });
  const [activePage, setActivePage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const LRUCachedFetch = useLRUCachedFetch(10);
  const [options, setOptions] = useState({
    gen: 1,
    take: 30,
    skip: 0,
  });
  const { data, isLoading, isError } =
    trpc.authViewer.user.getProfilePicturesByGen.useQuery({
      gen: options.gen,
      take: options.take,
      skip: options.skip,
    });
  return (
    <Combobox value={value} setValue={setValue} listItems={profilePictures}>
      {/* <div className="flex flex-col items-center">
        <div className="flex-inline justify-center space-x-2">

        </div>
      </div> */}
    </Combobox>
  );
};

export { PokemonComboBox };
