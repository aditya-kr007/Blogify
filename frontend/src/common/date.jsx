const month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const week = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

 const GetDate=(timestamp)=> {
    let date=new Date(timestamp)
    return `${date.getDate()} ${month[date.getMonth()]} `
}

export const GetFullDay=(timestamp)=>{
    let date=new Date(timestamp)
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
}

export default GetDate