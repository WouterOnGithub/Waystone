async function parseJson(res, fallbackMessage) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || fallbackMessage);
  }
  return res.json();
}

export async function getAccount() {
  const res = await fetch("/api/account", {
    credentials: "include",
  });
  return parseJson(res, "Failed to fetch account");
}

export async function updateAccount(payload) {
  // payload: { name, nickname, introduction, avatarFile? }
  let init;
  if (payload.avatarFile) {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("nickname", payload.nickname);
    form.append("introduction", payload.introduction);
    //form.append("avatar", payload.avatarFile);
    init = {
      method: "PUT",
      body: form,
      credentials: "include",
    };
  } else {
    init = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        nickname: payload.nickname,
        introduction: payload.introduction,
      }),
      credentials: "include",
    };
  }
  const res = await fetch("/api/account", init);
  return parseJson(res, "Failed to update account");
}