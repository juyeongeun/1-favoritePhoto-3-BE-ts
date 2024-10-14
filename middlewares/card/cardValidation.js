/* 판매할 포토카드 등록 시, 유효성 검사 */
const cardValidation = (req, res, next) => {
  const { name, grade, genre, description, totalCount, imageURL } = req.body;

  if (!name || !grade || !genre || !description || !totalCount || !imageURL) {
    return res.status(400).json({ message: "필수 입력 항목입니다." });
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "카드 이름은 3자 이상 입력해주세요." });
  }

  if (description.length < 10) {
    return res
      .status(400)
      .json({ message: "카드 설명은 10자 이상 입력해주세요." });
  }

  if (totalCount <= 0) {
    return res.status(400).json({ message: "총 발행량을 입력해주세요." });
  }

  next();
};

export default cardValidation;
