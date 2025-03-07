import { useGlobalVariables } from "@/utils/useContext";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DailySalesTrend = () => {

	const { weeklyPetAdoptedData } = useGlobalVariables();
	return (
		<motion.div
			className='bg-gray-200 bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-black mb-4'>Pet Adoption Trend</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={weeklyPetAdoptedData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='timePeriod' stroke='#000' />
						<YAxis stroke='#000' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.7)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Bar dataKey='petsAdopted' fill='#10B981' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default DailySalesTrend;
