// Instagram Integration
// Nurvi Jewel Instagram Profile Configuration

export const INSTAGRAM_CONFIG = {
  username: "nurvijewel", // Nurvi Jewel Instagram username
  profileUrl: "https://instagram.com/nurvijewel", // Nurvi Jewel Instagram URL
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "YOUR_ACCESS_TOKEN", // Instagram API token
}

export const getInstagramFeed = async () => {
  try {
    // Try to fetch from Instagram Basic Display API
    if (INSTAGRAM_CONFIG.accessToken && INSTAGRAM_CONFIG.accessToken !== "YOUR_ACCESS_TOKEN") {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_CONFIG.accessToken}`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          return data.data.slice(0, 6) // Return max 6 posts
        }
      }
    }

    // Fallback to curated Nurvi Jewel posts
    return [
      {
        id: "nurvi_1",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "✨ Stunning Kundan Necklace - Perfect for your next photoshoot! #NurviJewel #KundanJewelry #AntiTarnish",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      },
      {
        id: "nurvi_2", 
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "🔥 New Collection Alert! Rose Gold Necklaces trending now #NurviJewel #RoseGold #Trending",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      },
      {
        id: "nurvi_3",
        media_url: "/placeholder.svg?height=300&width=300", 
        caption: "💕 Customer Love! Thank you for choosing Nurvi Jewel #CustomerLove #NurviJewel #Testimonial",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      },
      {
        id: "nurvi_4",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "💍 Stackable Rings Collection - Mix and match for the perfect look #StackableRings #NurviJewel #MixAndMatch",
        permalink: "https://instagram.com/nurvijewel", 
        media_type: "IMAGE"
      },
      {
        id: "nurvi_5",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "✨ Behind the Scenes - Crafting your favorite pieces with love #Handmade #Craftsmanship #NurviJewel",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      },
      {
        id: "nurvi_6",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "🌟 Anti-tarnish technology keeps your jewelry looking brand new #AntiTarnish #Quality #NurviJewel",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      }
    ]
  } catch (error) {
    console.error("Error fetching Instagram feed:", error)
    // Return fallback data
    return [
      {
        id: "fallback_1",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "✨ Follow @nurvijewel for latest jewelry collections! #NurviJewel #AntiTarnish",
        permalink: "https://instagram.com/nurvijewel",
        media_type: "IMAGE"
      }
    ]
  }
}
