// Instagram Integration
// Replace with your actual Instagram credentials

export const INSTAGRAM_CONFIG = {
  username: "nurvijewel", // Replace with your actual Instagram username
  profileUrl: "https://instagram.com/nurvijewel", // Replace with your actual Instagram URL
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "YOUR_ACCESS_TOKEN", // Replace with your actual token
}

export const getInstagramFeed = async () => {
  try {
    // This is a mock implementation
    // Replace with actual Instagram Basic Display API call
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_CONFIG.accessToken}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram feed")
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching Instagram feed:", error)
    // Return mock data for development
    return [
      {
        id: "1",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "Beautiful gold earrings perfect for any occasion! ✨ #NurviJewel #AntiTarnish",
        permalink: "https://instagram.com/p/example1",
      },
      {
        id: "2",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "New collection alert! 🔥 These rose gold necklaces are trending #NurviJewel",
        permalink: "https://instagram.com/p/example2",
      },
      {
        id: "3",
        media_url: "/placeholder.svg?height=300&width=300",
        caption: "Customer love! Thank you for choosing Nurvi Jewel 💕 #CustomerLove",
        permalink: "https://instagram.com/p/example3",
      },
    ]
  }
}
