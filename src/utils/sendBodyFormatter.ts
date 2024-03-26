export default (body: any, type: "msg" | "body" = "msg") => {
  const sends = {
    msg: { message: body },
    body: body,
  };

  return sends[type];
};
