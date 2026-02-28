import React from 'react'
import TechnologyCard from '../cards/TechnologyCard'
import '@assets/styles/components/technoGrid.css'

interface Technology {
  id: number
  title: string
  color: string
  img: string
  icon: React.ReactNode
}

interface TechnoGridProps {
  technologies: Technology[]
  rows?: number
}

const TechnoGrid: React.FC<TechnoGridProps> = ({ technologies }) => {
  return (
    <div className="techno-grid">
      {technologies.map(tech => {
        return (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            icon={tech.icon}
            color={tech.color}
            img={tech.img}
          />
        )
      })}
    </div>
  )
}

export default TechnoGrid

// const rowsCards = useMemo(() => {
//   const length = technologies.length
//   const grid = []
//   let techIndex = 0

//   for (let i = 0; i < length; i++) {
//     const isEvenRow = i % 2 === 0
//     const rowSize = isEvenRow ? rows : rows - 1

//     const row = technologies.slice(techIndex, techIndex + rowSize)
//     grid.push(row)
//     techIndex += rowSize
//   }

//   return grid.filter(item => item.length !== 0)
// }, [technologies, rows])
// {
//   rowsCards.map((row, i) => {
//     return (
//       <div
//         key={i}
//         style={
//           i % 2 !== 0
//             ? {
//                 display: 'grid',
//                 gridTemplateColumns: `${1 / (rowsCards[0].length + 1)}fr repeat(1, 1fr) ${1 / (rowsCards[0].length + 1)}fr`,
//                 gap: `${24 / (rowsCards[0].length + 1)}px`
//               }
//             : {
//                 display: 'grid',
//                 gridTemplateColumns: `repeat(1, 1fr)`
//               }
//         }
//         className="techno-cards"
//       >
//         <div
//           className="techno-card"
//           style={{
//             display: 'grid',
//             gridTemplateColumns: `repeat(${i % 2 === 0 ? rows : rows - 1}, 1fr)`
//           }}
//         >
//           {row.map(tech => {
//             return (
//               <TechnologyCard
//                 key={tech.id}
//                 title={tech.title}
//                 icon={tech.icon}
//                 color={tech.color}
//                 img={tech.img}
//               />
//             )
//           })}
//         </div>
//       </div>
//     )
//   })
// }
