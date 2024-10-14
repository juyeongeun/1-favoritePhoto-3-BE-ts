// 판매할 포토카드 등록 시, 유효성 검사
const cardValidation = (req, res, next) => {
  // req.body에서 데이터를 추출
  const { name, grade, genre, description, totalCount } = req.body;

  // 이미지 파일도 유효성 검사 대상에 포함
  const imageURL = req.file ? req.file.location : "";

  if (!imageURL) {
    return res.status(400).json({ message: "이미지를 선택해주세요" });
  }

  if (!grade) {
    return res.status(400).json({ message: "등급을 선택해주세요" });
  }
  if (!genre) {
    return res.status(400).json({ message: "장르를 선택해주세요" });
  }

  if (!name || name.length < 3) {
    return res
      .status(400)
      .json({ message: "카드 이름은 3자 이상 입력해주세요." });
  }

  if (!description || description.length < 10) {
    return res
      .status(400)
      .json({ message: "카드 설명은 10자 이상 입력해주세요." });
  }

  if (!totalCount || totalCount <= 0) {
    return res.status(400).json({ message: "총 발행량을 입력해주세요." });
  }

  next();
};

export default cardValidation;
