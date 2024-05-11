import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { SquareUserRound } from "@ui/SVG";
import { Button } from "@ui/button";
import { Boxes } from "lucide-react";

type Product = {
  name: string;
  identifier: string;
  description: string;
  price: number;
  imageUrl: string;
};

const ItemCard = ({ product }: { product: Product }) => (
  <Card className="relative flex h-full flex-col justify-between rounded-none border border-primary bg-background text-textBase animate-bootUp">
    <CardHeader className="p-x-2 p-y-4 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-lg">{product.name}</CardTitle>
      <Boxes
        width={24}
        height={24}
        className="absolute right-2 top-2 text-primary"
      />
    </CardHeader>
    <CardContent className="flex flex-col space-y-4 items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={100}
        height={100}
      />
      <div className="space-y-2 w-full">
        <div className="flex justify-between">
          <p>{product.identifier}</p>
          <p className="text-primary">{product.price.toFixed(2)}</p>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="default" size="default" className="w-full">
        Add to Cart
      </Button>
    </CardFooter>
  </Card>
);

export { ItemCard };
