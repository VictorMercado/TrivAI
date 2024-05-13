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
  <Card className="relative flex h-full animate-bootUp flex-col justify-between rounded-none border border-primary bg-background text-textBase">
    <CardHeader className="p-x-2 p-y-4 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-lg">{product.name}</CardTitle>
      <Boxes
        width={24}
        height={24}
        className="absolute right-2 top-2 text-primary"
      />
    </CardHeader>
    <CardContent className="flex flex-col items-center space-y-4">
      <Image
        unoptimized
        src={product.imageUrl}
        alt={product.name}
        width={100}
        height={100}
      />
      <div className="w-full space-y-2">
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
