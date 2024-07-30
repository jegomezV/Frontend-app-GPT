export const getUser = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    const data = await response.json()
    return data.user
  } catch (e) {
    console.log(e)
  }
}
