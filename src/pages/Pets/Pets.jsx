import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { petCategories } from "@/constants/data";
import "./petspage.scss";

import PetCard from "@/components/Cards/PetCard/PetCard";
import Loader from "@/components/Loader/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import { GET_SHOP_PETS_BY_QUERY } from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
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

const Pets = () => {
  // const { data, loading } = useFetch(GET_ALL_SHOP_PETS);
  const [category, setCategory] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    setLoading(true);
    const genderQuery = selectedGenders.join(",");
    const sizeQuery = selectedSizes.join(",");
    const colorQuery = selectedColors.join(",");
    const cancelToken = axios.CancelToken.source();
    axios
      .get(
        `${GET_SHOP_PETS_BY_QUERY}?category=${category}&gender=${genderQuery}&size=${sizeQuery}&color=${colorQuery}&sort=${sortOption}`,
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
    selectedGenders,
    selectedSizes,
    selectedColors,
    sortOption,
  ]);

  const handleGenderChange = (gender) => {
    setSelectedGenders((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((g) => g !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((g) => g !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    if (data) {
      const filteredData = data.filter((pet) => {
        return (
          pet.petName.toLowerCase().includes(query.toLowerCase()) ||
          pet.petBreed.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredData(filteredData);
    }
  };

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="pets-page-container hidden-scrollbar">
      <div className="pets-category-box">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {petCategories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/6  max-[865px]:basis-1/4 max-[550px]:basis-1/3"
              >
                <div
                  className="category"
                  onClick={() => {
                    setCategory(category.name.toLowerCase());
                  }}
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
            <h3>Gender</h3>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="male"
                checked={selectedGenders.includes("male")}
                onCheckedChange={() => handleGenderChange("male")}
              />
              <label
                htmlFor="male"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Male
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <Checkbox
                id="female"
                checked={selectedGenders.includes("female")}
                onCheckedChange={() => handleGenderChange("female")}
              />
              <label
                htmlFor="female"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Female
              </label>
            </div>
          </div>

          <div className="filters">
            <h3>Size</h3>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="small"
                checked={selectedSizes.includes("small")}
                onCheckedChange={() => handleSizeChange("small")}
              />
              <label
                htmlFor="small"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Small
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="medium"
                checked={selectedSizes.includes("medium")}
                onCheckedChange={() => handleSizeChange("medium")}
              />
              <label
                htmlFor="medium"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Medium
              </label>
            </div>
            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="large"
                checked={selectedSizes.includes("large")}
                onCheckedChange={() => handleSizeChange("large")}
              />
              <label
                htmlFor="large"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Large
              </label>
            </div>
          </div>

          <div className="filters">
            <h3>Color</h3>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="red"
                checked={selectedColors.includes("red")}
                onCheckedChange={() => handleColorChange("red")}
              />
              <label
                htmlFor="red"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                Red
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="apricot"
                checked={selectedColors.includes("apricot")}
                onCheckedChange={() => handleColorChange("apricot")}
              />
              <label
                htmlFor="apricot"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#FFB672]"></div>
                Apricot
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="black"
                checked={selectedColors.includes("black")}
                onCheckedChange={() => handleColorChange("black")}
              />
              <label
                htmlFor="black"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#262A33]"></div>
                Black
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="silver"
                checked={selectedColors.includes("silver")}
                onCheckedChange={() => handleColorChange("silver")}
              />
              <label
                htmlFor="silver"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#CECECE]"></div>
                Silver
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-6 mb-4">
              <Checkbox
                id="tan"
                checked={selectedColors.includes("tan")}
                onCheckedChange={() => handleColorChange("tan")}
              />
              <label
                htmlFor="tan"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#FFF8CE]"></div>
                Tan
              </label>
            </div>
          </div>
        </div>

        <div className="pets-detail-box">
          <div className="pet-search">
            <Input
              type="select"
              placeholder="Search pet.."
              value={searchQuery}
              onChange={(e) => handleSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 max-[450px]:grid max-[450px]:grid-cols-2">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[250px]">
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
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      <div></div>
                    </SheetDescription>
                  </SheetHeader>
                  <div className="filter-box ">
                    <div className="filters">
                      <h3>Gender</h3>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="male"
                          checked={selectedGenders.includes("male")}
                          onCheckedChange={() => handleGenderChange("male")}
                        />
                        <label
                          htmlFor="male"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <Checkbox
                          id="female"
                          checked={selectedGenders.includes("female")}
                          onCheckedChange={() => handleGenderChange("female")}
                        />
                        <label
                          htmlFor="female"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Female
                        </label>
                      </div>
                    </div>

                    <div className="filters">
                      <h3>Size</h3>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="small"
                          checked={selectedSizes.includes("small")}
                          onCheckedChange={() => handleSizeChange("small")}
                        />
                        <label
                          htmlFor="small"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Small
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="medium"
                          checked={selectedSizes.includes("medium")}
                          onCheckedChange={() => handleSizeChange("medium")}
                        />
                        <label
                          htmlFor="medium"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Medium
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="large"
                          checked={selectedSizes.includes("large")}
                          onCheckedChange={() => handleSizeChange("large")}
                        />
                        <label
                          htmlFor="large"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Large
                        </label>
                      </div>
                    </div>

                    <div className="filters">
                      <h3>Color</h3>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="red"
                          checked={selectedColors.includes("red")}
                          onCheckedChange={() => handleColorChange("red")}
                        />
                        <label
                          htmlFor="red"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                          Red
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="apricot"
                          checked={selectedColors.includes("apricot")}
                          onCheckedChange={() => handleColorChange("apricot")}
                        />
                        <label
                          htmlFor="apricot"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#FFB672]"></div>
                          Apricot
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="black"
                          checked={selectedColors.includes("black")}
                          onCheckedChange={() => handleColorChange("black")}
                        />
                        <label
                          htmlFor="black"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#262A33]"></div>
                          Black
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="silver"
                          checked={selectedColors.includes("silver")}
                          onCheckedChange={() => handleColorChange("silver")}
                        />
                        <label
                          htmlFor="silver"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#CECECE]"></div>
                          Silver
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 ml-6 mb-4">
                        <Checkbox
                          id="tan"
                          checked={selectedColors.includes("tan")}
                          onCheckedChange={() => handleColorChange("tan")}
                        />
                        <label
                          htmlFor="tan"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#FFF8CE]"></div>
                          Tan
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter> */}
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="pet-detail-cards">
            {loading ? (
              <Loader />
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <PetCard
                    forceUpdate={forceUpdate}
                    petData={item}
                    path={item?._id}
                  />
                </motion.div>
              ))
            ) : (
              <p>No pets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pets;
