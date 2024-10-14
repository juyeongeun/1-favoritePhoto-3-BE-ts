const exchangeValidation = (req, res, next) => {
  const { myCardId = "", description = "", count = "" } = req.body;

  if (!myCardId || !description || !count) {
    return res.status(400).send({
      message: "이메일, 닉네임, 비밀번호는 필수 값입니다.",
      data: {
        myCardId,
        description,
        count,
      },
    });
  }
  if (typeof myCardId !== "number") {
    return res.status(400).send({
      message: "유효한 카드 아이디가 아닙니다.",
      data: {
        myCardId,
      },
    });
  }

  if (
    typeof description !== "string" ||
    description.length < 1 ||
    description.length > 20
  ) {
    return res.status(400).send({
      message: "닉네임은 1자 이상 20자 미만 입니다.",
      data: {
        description,
      },
    });
  }

  if (typeof count !== "number") {
    return res.status(400).send({
      message: "교환할 카드의 수는 숫자만 가능합니다.",
      data: {
        count,
      },
    });
  }

  next();
};

export default exchangeValidation;
