import { useGlobalVariables } from "@/utils/useContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";



const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
	const {productCategoryData} = useGlobalVariables()
	const categoryData = [
		{ name: "Pet Food", value: productCategoryData?.petFood },
		{ name: "Grooming", value: productCategoryData?.grooming },
		{ name: "Toys", value: productCategoryData?.toys },
		{ name: "Bedding", value: productCategoryData?.bedding },
		{ name: "Healthcare", value: productCategoryData?.healthcare },
		{ name: "Clothing", value: productCategoryData?.clothing },
		{ name: "Accessories", value: productCategoryData?.accessories },
	];
	return (
		<motion.div
			className='bg-gray-200 bg-opacity-30 backdrop-blur-md shadow-xl rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-black'>Product Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={categoryData.filter((entry) => entry.value > 0)}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CategoryDistributionChart;
