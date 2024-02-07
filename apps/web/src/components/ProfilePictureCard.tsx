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

type Product = {
  name: string;
  identifier: string;
  description: string;
  price: number;
  imageUrl: string;
}


const ProfilePictureCard = ({ product }: { product: Product }) => (
  <Card className="relative flex flex-col rounded-none border border-primary bg-background text-textBase h-full justify-between">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-x-2 p-y-4">
      <CardTitle className="text-lg">{product.name}</CardTitle>
      <SquareUserRound size={24} className="absolute top-2 right-2 text-primary"/>
    </CardHeader>
    <CardContent className="flex flex-col space-y-4 items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={250}
        height={250}
      />
      <div className="w-full">
        <div className="flex justify-between">
          <p>{product.identifier}</p>
          <p className="text-primary">{product.price.toFixed(2)}</p>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="default" size="default" className="w-full">
        Add to Cart
      </Button>
    </CardFooter>
  </Card>
);

export { ProfilePictureCard };