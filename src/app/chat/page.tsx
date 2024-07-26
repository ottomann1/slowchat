const fakechats = [
  {
    id: 1,
    userId: 1,
    content: "hello whats up",
    time: new Date(),
  },
  {
    id: 2,
    userId: 1,
    content: "this app is amazing",
    time: new Date(),
  },
  {
    id: 3,
    userId: 2,
    content: "i agree",
    time: new Date(),
  },
];


export default function chat(){


  return (<><div>
      <div className="flex w-full flex-col">
        <div className="card bg-base-300 rounded-box">
          {fakechats.map((message)=>(
              <div key={message.id} className="chat chat-start">
                <div className="chat-header">
                {message.userId}
                  <time className="text-xs opacity-50">{message.time.toString()}</time>
                </div>
                <div className="chat-bubble">{message.content}</div>
              </div>
          ))}
          </div>
          <div className="divider"></div>
          <div className="card bg-base-300 rounded-box grid h-20 place-items-center">
            <div className="join">
              <input type="text" placeholder="Enter your message here..." className="input input-bordered w-full max-w-xs" />
              <button className="btn">Send</button>
            </div>
          </div>
        </div>
      </div></>

         )

}
