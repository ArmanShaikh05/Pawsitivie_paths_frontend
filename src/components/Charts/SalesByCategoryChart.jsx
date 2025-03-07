import { useGlobalVariables } from "@/utils/useContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
	const {petCategoryData} = useGlobalVariables()
	const salesByCategory = [
		{ name: "Cats", value: petCategoryData?.cats },
		{ name: "Dogs", value: petCategoryData?.dogs },
		{ name: "Birds", value: petCategoryData?.birds },
		{ name: "Fishes", value: petCategoryData?.fishs },
		{ name: "Rabbits", value: petCategoryData?.rabbits },
		{ name: "Turtles", value: petCategoryData?.turtles },
	];
	return (
		<motion.div
			className='bg-gray-200 bg-opacity-30 backdrop-blur-md shadow-xl rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-black mb-4'>Pets Category</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={salesByCategory.filter((entry) => entry.value > 0)}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{salesByCategory.map((entry, index) => (
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
export default SalesByCategoryChart;
