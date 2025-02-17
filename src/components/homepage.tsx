import { Card, CardContent } from "@/components/ui/card";
import { Github, School, Newspaper } from "lucide-react";
import { Waves, Server, Ruler, Satellite, Bolt } from "lucide-react"
import { motion } from "framer-motion";
import CarouselHomePage from "./CarrouselHomePage";
import { Timeline } from "@/components/Timeline";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.4, ease: "easeOut" },
  }),
};

export default function HomePage() {
  return (
<main className="flex items-center justify-center mt-30">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-3 p-4 md:max-w-[800px] lg:max-w-[900px]">
    
    {/* Profile Card */}
    <motion.div
      variants={cardVariants}
      custom={0}
      initial="hidden"
      animate="visible"
      className="md:col-span-2 lg:col-span-2"
    >
      <Card className="p-6 flex items-center hover:drop-shadow-xl hover:dark:drop-shadow-[0_5px_10px_rgba(255,255,255,0.1)]">
        <CardContent className="flex items-center gap-4 place-content-center">
          <img src="/images/profile.jpg" alt="Profile" className="w-40 h-40 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">Ammar Mian</h1>
            <p className="text-gray-500">Associate Professor at Université Savoie Mont Blanc</p>
            <div className="flex mt-2 gap-4">
              <a href="https://github.com/ammarmian/" className="flex items-center gap-2 hover:text-gray-500">
                <Github size={20} /> Github
              </a>
              <a href="https://scholar.google.com/citations?user=XDirnBMAAAAJ&hl=en" className="flex items-center gap-2 hover:text-gray-500">
                <School size={20} /> Scholar
              </a>
            </div>
            <p className="mt-1"><b>Contact:</b> ammar.mian at univ-smb.fr</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* About Me (spans 1 column but 2 rows) */}
    <motion.div
      variants={cardVariants}
      custom={1}
      initial="hidden"
      animate="visible"
      className="md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 hover:drop-shadow-xl hover:dark:drop-shadow-[0_5px_10px_rgba(255,255,255,0.1)]"
    >

      <Card className="p-6">
        <h1 className="text-xl font-bold mb-3">Research interests:</h1>

        <ul className="list-none pl-0 space-y-2">
            <li className="flex items-center gap-2">
            <Waves size={20} className="text-blue-500" />
            <span>Statistical Signal Processing</span>
            </li>
            <li className="flex items-center gap-2">
            <Server size={20} className="text-green-500" />
            <span>Machine Learning</span>
            </li>
            <li className="flex items-center gap-2">
            <Ruler size={20} className="text-purple-500" />
            <span>Riemannian Geometry</span>
            </li>
            <li className="flex items-center gap-2">
            <Satellite size={20} className="text-indigo-500" />
            <span>Remote Sensing</span>
            </li>
            <li className="flex items-center gap-2">
            <Bolt size={20} className="text-yellow-500" />
            <span>Frugal Computations</span>
            </li>
        </ul>

      </Card>
    </motion.div>

    {/* News Card (directly below Profile Card) */}
    <motion.div
      variants={cardVariants}
      custom={2}
      initial="hidden"
      animate="visible"
      className="md:col-span-2 lg:col-span-2 hover:drop-shadow-xl hover:dark:drop-shadow-[0_5px_10px_rgba(255,255,255,0.1)]"
    >
      <Card className="p-6">
        <CardContent>
            <h1 className="text-xl font-bold mb-3">News</h1>
        <ul className="list-none pl-0 space-y-2">
            <li className="flex items-center gap-3">
              <Newspaper size={40}/> <span>Looking for an Internship (M2) in Measuring Energy costs of Federated Machine Learning models. See <a className="text-gray-500" href="https://www.univ-smb.fr/listic/wp-content/uploads/sites/66/2024/12/sujet_stage_mesure_machine_learning.pdf">here</a>.</span>
              </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>

      <motion.div variants={cardVariants} custom={5} initial="hidden" animate="visible" className="md:col-span-2 lg:col-span-2 row-span-1">
        <Card className="p-6 hover:drop-shadow-xl hover:dark:drop-shadow-[0_5px_10px_rgba(255,255,255,0.1)]">
          <CardContent>
            <h1 className="text-xl font-bold">Positions</h1>
            <div className="mt-4"><Timeline /></div>
          </CardContent>
        </Card>
      </motion.div>

    {/* Empty Space to Align Qanat Card */}
    <motion.div
      variants={cardVariants}
      custom={4}
      initial="hidden"
      animate="visible"
      className="md:col-start-3 lg:col-start-3 md:-mt-40 lg:-mt-40"
    >
      <a href="/cv.pdf">
        <Card className="p-6 min-h-[100px] w-full bg-linear-to-r from-cyan-500 to-blue-500 flex place-content-center items-center transition-transform duration-300 transform hover:scale-105 peer ">
                <h2 className="text-xl font-bold text-white justify-center">Curriculum Vitae</h2>
        </Card>
      </a>
    </motion.div>


    <motion.div
      variants={cardVariants}
      custom={5}
      initial="hidden"
      animate="visible"
      className="md:col-start-3 lg:col-start-3 md:-mt-115 lg:-mt-115"
    >
      <a href="https://github.com/ammarmian/qanat">
        <Card className="p-6 min-h-[250px] w-full bg-[url(/images/qanat.png)] bg-cover transition-transform duration-300 transform hover:scale-105 peer ">
        </Card>
      </a>
    </motion.div>

    <motion.div
      variants={cardVariants}
      custom={6}
      initial="hidden"
      animate="visible"
      className="md:col-start-3 lg:col-start-3 md:-mt-52 lg:-mt-52"
    >
      <a href="https://github.com/ammarmian/anotherspdnet">
        <Card className="p-6 min-h-[100px] w-full bg-linear-to-r from-cyan-500 to-blue-500 flex place-content-center items-center transition-transform duration-300 transform hover:scale-105 peer ">
                <h2 className="text-xl font-bold text-white justify-center">AnotherSPDNet</h2>
        </Card>
      </a>
    </motion.div>


    </div>
    </main>
  );
}

