import React, { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import "./card.css"
import LoadAvatar from "./LoadAvatar"
export default function Card({ quote, fontFamily, textColor }) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const cardData = {
    quote,
    website: "messagedadieu.com",
    illustrationUrl: "/placeholder.svg?height=90&width=120",
  }

  const cards = [0, 1, 2].map((index) => {
    const cardStyle = {
      transform: `translateX(${(index - position) * 120}%)`,
      opacity: 1,
      transition: "transform 0.8s ease, opacity 0.8s ease",
      zIndex: 3 - index,
    }

    return (
      <div key={index} className="card-container" style={cardStyle}>
        <div
          className="card"
          style={{
            background: `linear-gradient(135deg, { color: textColor } 0%, #{ color: textColor }100%)`,
          }}
        >
          <div className="card-blur"></div>
          <div className="card-content">
            <div className="website" style={{ color: textColor }}>
              {cardData.website}
            </div>
            <p
              className="quote"
              style={{
                fontSize: "1.2rem",
                fontFamily: fontFamily,
                color: textColor,
              }}
            >
              {cardData.quote}
            </p>
            <div className="illustration">
              <img src={cardData.illustrationUrl} alt="Illustration" className="couple-image" />
              <div className="heart-container">
                <Heart className="heart" size={30} fill="#e57373" color="#e57373" />
              </div>
            </div>
          </div>
          <div className="card-decoration"></div>
        </div>
      </div>
    )
  })

  return <div className="cards-wrapper">{cards}</div>
}
