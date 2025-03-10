import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { marketplaceCategories } from "@/constants/data";
import "./marketplace.scss";

import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { GET_PRODUCTS_BY_QUERY } from "@/constants/routes";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";

const Marketplace = () => {
  const [category, setCategory] = useState("");
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [selectedPetAges, setSelectedPetAges] = useState([]);
  const [selectedProductMaterials, setSelectedProductMaterials] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    setLoading(true);
    const petTypeQuery = selectedPetTypes.join(",");
    const petAgeQuery = selectedPetAges.join(",");
    const productMaterialQuery = selectedProductMaterials.join(",");
    const cancelToken = axios.CancelToken.source();
    axios
      .get(
        `${GET_PRODUCTS_BY_QUERY}?category=${category}&type=${petTypeQuery}&age=${petAgeQuery}&material=${productMaterialQuery}&sort=${sortOption}`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then(({ data }) => {
        setData(data.data);
        setFilteredData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [
    category,
    reducerValue,
    sortOption,
    selectedPetTypes,
    selectedPetAges,
    selectedProductMaterials,
  ]);

  const hanldePetTypeChange = (gender) => {
    setSelectedPetTypes((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  const hanldePetAgeChange = (gender) => {
    setSelectedPetAges((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  const hanldeProductMaterialChange = (gender) => {
    setSelectedProductMaterials((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    if (data) {
      const filteredData = data.filter((product) => {
        return (
          product.productName.toLowerCase().includes(query.toLowerCase()) ||
          product.petType.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredData(filteredData);
    }
  };

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
  };

  return (
    <div className="pets-page-container hidden-scrollbar">
      <div className="pets-category-box">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {marketplaceCategories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/6  max-[865px]:basis-1/4 max-[550px]:basis-1/3"
              >
                <div
                  key={category.id}
                  onClick={() => {
                    setCategory(category.tag);
                  }}
                  className="category"
                >
                  <img src={category.img} alt="Dog" />
                  <h3>{category.name}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="pets-content-area">
        <div className="filter-box hidden lg:block">
          <h3>Filters</h3>
          <div className="filters">
            <h3>Pet Type</h3>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Dogs"
                checked={selectedPetTypes.includes("dogs")}
                onCheckedChange={() => hanldePetTypeChange("dogs")}
              />
              <label
                htmlFor="Dogs"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dogs
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Cats"
                checked={selectedPetTypes.includes("cats")}
                onCheckedChange={() => hanldePetTypeChange("cats")}
              />
              <label
                htmlFor="Cats"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cats
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Birds"
                checked={selectedPetTypes.includes("birds")}
                onCheckedChange={() => hanldePetTypeChange("birds")}
              />
              <label
                htmlFor="Birds"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Birds
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Fish"
                checked={selectedPetTypes.includes("fish")}
                onCheckedChange={() => hanldePetTypeChange("fish")}
              />
              <label
                htmlFor="Fish"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Fish
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 ">
              <Checkbox
                id="SmallAnimals"
                checked={selectedPetTypes.includes("samllAnimals")}
                onCheckedChange={() => hanldePetTypeChange("samllAnimals")}
              />
              <label
                htmlFor="SmallAnimals"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Small Animals
              </label>
            </div>
          </div>

          <div className="filters">
            <h3>Pet Age</h3>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Puppy/Kitten"
                checked={selectedPetAges.includes("child")}
                onCheckedChange={() => hanldePetAgeChange("child")}
              />
              <label
                htmlFor="Puppy/Kitten"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Puppy/Kitten
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Adult"
                checked={selectedPetAges.includes("adult")}
                onCheckedChange={() => hanldePetAgeChange("adult")}
              />
              <label
                htmlFor="Adult"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Adult
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Senior"
                checked={selectedPetAges.includes("senior")}
                onCheckedChange={() => hanldePetAgeChange("senior")}
              />
              <label
                htmlFor="Senior"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Senior
              </label>
            </div>
          </div>

          <div className="filters">
            <h3>Material</h3>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Plastic"
                checked={selectedProductMaterials.includes("plastic")}
                onCheckedChange={() => hanldeProductMaterialChange("plastic")}
              />
              <label
                htmlFor="Plastic"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Plastic
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Rubber"
                checked={selectedProductMaterials.includes("rubber")}
                onCheckedChange={() => hanldeProductMaterialChange("rubber")}
              />
              <label
                htmlFor="Rubber"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Rubber
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Cotton"
                checked={selectedProductMaterials.includes("cotton")}
                onCheckedChange={() => hanldeProductMaterialChange("cotton")}
              />
              <label
                htmlFor="Cotton"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cotton
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Leather"
                checked={selectedProductMaterials.includes("leather")}
                onCheckedChange={() => hanldeProductMaterialChange("leather")}
              />
              <label
                htmlFor="Leather"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Leather
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Metal"
                checked={selectedProductMaterials.includes("metal")}
                onCheckedChange={() => hanldeProductMaterialChange("metal")}
              />
              <label
                htmlFor="Metal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Metal
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="Others"
                checked={selectedProductMaterials.includes("others")}
                onCheckedChange={() => hanldeProductMaterialChange("others")}
              />
              <label
                htmlFor="Others"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Others
              </label>
            </div>
          </div>
        </div>

        <div className="pets-detail-box">
          <div className="pet-search">
            <Input
              type="select"
              placeholder="Search product.."
              value={searchQuery}
              onChange={(e) => handleSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 max-[450px]:grid max-[450px]:grid-cols-2">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="popular">Popular</SelectItem> */}
                  <SelectItem value="cheap">Cheap</SelectItem>
                  <SelectItem value="expensive">Expensive</SelectItem>
                </SelectContent>
              </Select>

              {/* FILTER SHEET */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <IoFilter />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-56">
                  <SheetHeader>
                    <SheetTitle><div></div></SheetTitle>
                    <SheetDescription>
                      <div></div>
                    </SheetDescription>
                  </SheetHeader>

                  <div className="filter-box ">
                    <h3>Filters</h3>
                    <div className="filters">
                      <h3>Pet Type</h3>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Dogs"
                          checked={selectedPetTypes.includes("dogs")}
                          onCheckedChange={() => hanldePetTypeChange("dogs")}
                        />
                        <label
                          htmlFor="Dogs"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Dogs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Cats"
                          checked={selectedPetTypes.includes("cats")}
                          onCheckedChange={() => hanldePetTypeChange("cats")}
                        />
                        <label
                          htmlFor="Cats"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cats
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Birds"
                          checked={selectedPetTypes.includes("birds")}
                          onCheckedChange={() => hanldePetTypeChange("birds")}
                        />
                        <label
                          htmlFor="Birds"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Birds
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Fish"
                          checked={selectedPetTypes.includes("fish")}
                          onCheckedChange={() => hanldePetTypeChange("fish")}
                        />
                        <label
                          htmlFor="Fish"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Fish
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 ">
                        <Checkbox
                          id="SmallAnimals"
                          checked={selectedPetTypes.includes("samllAnimals")}
                          onCheckedChange={() =>
                            hanldePetTypeChange("samllAnimals")
                          }
                        />
                        <label
                          htmlFor="SmallAnimals"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Small Animals
                        </label>
                      </div>
                    </div>

                    <div className="filters">
                      <h3>Pet Age</h3>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Puppy/Kitten"
                          checked={selectedPetAges.includes("child")}
                          onCheckedChange={() => hanldePetAgeChange("child")}
                        />
                        <label
                          htmlFor="Puppy/Kitten"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Puppy/Kitten
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Adult"
                          checked={selectedPetAges.includes("adult")}
                          onCheckedChange={() => hanldePetAgeChange("adult")}
                        />
                        <label
                          htmlFor="Adult"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Adult
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Senior"
                          checked={selectedPetAges.includes("senior")}
                          onCheckedChange={() => hanldePetAgeChange("senior")}
                        />
                        <label
                          htmlFor="Senior"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Senior
                        </label>
                      </div>
                    </div>

                    <div className="filters">
                      <h3>Material</h3>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Plastic"
                          checked={selectedProductMaterials.includes("plastic")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("plastic")
                          }
                        />
                        <label
                          htmlFor="Plastic"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Plastic
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Rubber"
                          checked={selectedProductMaterials.includes("rubber")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("rubber")
                          }
                        />
                        <label
                          htmlFor="Rubber"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Rubber
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Cotton"
                          checked={selectedProductMaterials.includes("cotton")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("cotton")
                          }
                        />
                        <label
                          htmlFor="Cotton"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cotton
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Leather"
                          checked={selectedProductMaterials.includes("leather")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("leather")
                          }
                        />
                        <label
                          htmlFor="Leather"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Leather
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Metal"
                          checked={selectedProductMaterials.includes("metal")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("metal")
                          }
                        />
                        <label
                          htmlFor="Metal"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Metal
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="Others"
                          checked={selectedProductMaterials.includes("others")}
                          onCheckedChange={() =>
                            hanldeProductMaterialChange("others")
                          }
                        />
                        <label
                          htmlFor="Others"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Others
                        </label>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {loading ? (
            <Loader position="top" />
          ) : (
            <div className="pet-detail-cards">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                  >
                    <ProductCard
                      productData={item}
                      path={`/market/${item?._id}`}
                      forceUpdate={forceUpdate}
                    />
                  </motion.div>
                ))
              ) : (
                <p>No product found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
