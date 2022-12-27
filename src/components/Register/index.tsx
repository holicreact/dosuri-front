import * as Yup from "yup";

import { CSSObject, useTheme } from "@emotion/react";
import { Field, useFormik, FormikProvider } from "formik";
import { LOCATIONS, do_si } from "./location";
import Select, {
  DropdownIndicatorProps,
  ValueContainerProps,
  components,
} from "react-select";
import { Symtom, Symtoms } from "@/mock/symtoms";
import { FormEvent, useId, useState } from "react";

import Button from "@/components/Button";
import Icon from "@/util/Icon";
import { checkNicknameDuplication } from "@/service/apis/user";
import styled from "@emotion/styled";
import { useQuery } from "react-query";

interface MyFormValues {
  nickname: string;
  birthday: string;
  phone: string;
  gender: string;
  location1: string;
  location2: string;
  symtoms: string[];
}

const RegisterForm: React.FC<{}> = () => {
  const initialValues: MyFormValues = {
    nickname: "",
    birthday: "",
    phone: "",
    gender: "",
    location1: "",
    location2: "",
    symtoms: [],
  };
  const theme = useTheme();
  const [symtoms, setSymtoms] = useState<Symtom[]>(Symtoms);
  const [dosi, setDosi] = useState<string>();
  const [gudong, setGudong] = useState<string>();
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [didNicknameValidCheck, setDidNicknameValidCheck] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      nickname: Yup.string().min(2).max(15).required(),
      phone: Yup.string().length(8).required(),
      birthday: Yup.string().length(8).required(),
      gender: Yup.string().required(),
      location1: Yup.string().required(),
      location2: Yup.string().required(),
      symtoms: Yup.array().required(),
    }),
    onSubmit: () => {},
  });

  console.log(formik.values);

  const { refetch } = useQuery(
    ["nicknameDuplication", formik.values.nickname],
    () => checkNicknameDuplication(formik.values.nickname),
    {
      enabled: false,
      suspense: false,
      onSuccess: (resp) => {
        if (resp.status === 200) {
          setIsNicknameValid(true);
        } else {
          setIsNicknameValid(false);
        }
        setDidNicknameValidCheck(true);
      },
    }
  );

  const onNicknameValidation = () => {
    refetch();
  };

  const id1 = useId();
  const id2 = useId();
  /**
   * ts 적용
   * https://stackoverflow.com/questions/66546842/add-typescript-types-to-react-select-onchange-function
   */

  const onDoSiSelect = (selectedValue: any) => {
    setDosi(selectedValue.value);
  };

  const onGuDongSelect = (selectedValue: any) => {
    setGudong(selectedValue.value);
  };

  const onSymtomClick = (symtom: Symtom, formikState: typeof formik) => {
    formikState.setFieldValue("symtoms", [
      ...formik.values.symtoms,
      symtom.title,
    ]);
    setSymtoms((prev) => {
      const selectedIndex = prev.findIndex((s) => s.title === symtom.title);
      const currentStatus = prev[selectedIndex].selected;
      prev[selectedIndex].selected = !currentStatus;

      return [...prev];
    });
  };

  const colourStyles: any = {
    container: (styles: CSSObject) => ({
      ...styles,
      flexGrow: 1,
      width: "calc(50% - 2rem)",
    }),
    control: (styles: CSSObject) => ({
      ...styles,
      borderRadius: "0.5rem",
      border: `0.1rem solid ${theme.colors.grey}`,
      boxShadow: "none",
      "&:hover": {
        border: `0.1rem solid ${theme.colors.grey}`,
      },
      cursor: "text",
      height: "4.2rem",
      padding: "0 1rem",
    }),
    menu: (styles: CSSObject) => ({
      border: `0.1rem solid ${theme.colors.purple}`,
      borderRadius: "0.5rem",
    }),
    option: (styles: CSSObject, { isDisabled }: any) => ({
      ...styles,
      color: `${theme.colors["black"]}`,
      backgroundColor: `${theme.colors.white}`,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.lg,
      ":active": {
        ...styles[":active"],
        backgroundColor: `${theme.colors.white}`,
      },
      ":hover": {
        backgroundColor: "rgba(152, 143, 255, 0.2)",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
    }),
    placeholder: (styles: CSSObject) => ({
      ...styles,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.lg,
    }),
    valueContainer: (styles: CSSObject) => ({
      ...styles,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.lg,
      padding: 0,
      margin: 0,
    }),
  };

  const CustomIcon = () => {
    return (
      <div css={{ cursor: "pointer" }}>
        <Icon name={`chevron`} width="1.6rem" height="1.6rem" />
      </div>
    );
  };
  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
      <components.DropdownIndicator {...props}>
        <CustomIcon />
      </components.DropdownIndicator>
    );
  };
  const ValueContainer = (props: ValueContainerProps) => {
    return (
      <components.ValueContainer {...props}>
        {props.children}
      </components.ValueContainer>
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <FormWrapper>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="divider nickname">
              <label className="label" htmlFor="nickname">
                닉네임
              </label>
              <div className="input-section">
                <Field
                  className={
                    "field" +
                    (formik.errors.nickname && formik.touched.nickname
                      ? " is-invalid"
                      : "")
                  }
                  id="nickname"
                  name="nickname"
                  placeholder="2글자 이상 10글자 이하"
                  onChange={formik.handleChange}
                  value={formik.values.nickname}
                />
                <Button
                  text="중복확인"
                  backgroundColor={theme.colors.purple_light2}
                  disabled={
                    formik.values.nickname.length === 0 ||
                    !!formik.errors.nickname
                  }
                  onClick={onNicknameValidation}
                />
              </div>

              <div className="noti">
                {didNicknameValidCheck ? (
                  isNicknameValid ? (
                    <div className="valid">사용 가능한 닉네임입니다.</div>
                  ) : (
                    <div className="invalid">사용 불가능한 닉네임입니다.</div>
                  )
                ) : (
                  <div className="invisible">dd</div>
                )}
              </div>
            </div>

            <div className="divider">
              <label className="label" htmlFor="phone">
                핸드폰 번호
              </label>

              <div className="input-section phone">
                <div className="phone-prefix">010</div>
                <Field
                  className={
                    "field" +
                    (formik.errors.phone && formik.touched.phone
                      ? " is-invalid"
                      : "")
                  }
                  id="phone"
                  name="phone"
                  placeholder="숫자만 입력"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </div>
            </div>

            <div className="divider">
              <label className="label" htmlFor="birthday">
                생년월일
              </label>
              <Field
                className={
                  "field" +
                  (formik.errors.birthday && formik.touched.birthday
                    ? " is-invalid"
                    : "")
                }
                id="birthday"
                name="birthday"
                placeholder="예: 19901230"
                onChange={formik.handleChange}
                value={formik.values.birthday}
              />
            </div>

            <div className="divider">
              <label className="label">성별</label>
              <div
                className="sex-section"
                role="group"
                aria-labelledby="my-radio-group"
              >
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    onChange={formik.handleChange}
                    value="male"
                  />
                  <span>남자</span>
                </label>
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    onChange={formik.handleChange}
                    value="female"
                  />
                  <span>여자</span>
                </label>
              </div>
            </div>

            <div className="divider">
              <label className="label">지역</label>
              <div className="select-section">
                <Select
                  options={do_si.sort((a, b) => (a.label > b.label ? 1 : -1))}
                  instanceId={id1}
                  components={{
                    ValueContainer,
                    DropdownIndicator,
                    IndicatorSeparator: null,
                  }}
                  styles={colourStyles}
                  placeholder="시/도 선택"
                  onChange={(selectedOption: any) => {
                    onDoSiSelect(selectedOption);
                    formik.setFieldValue("location1", selectedOption.value);
                  }}
                />
                <Select
                  isDisabled={!dosi}
                  options={LOCATIONS.filter((location) =>
                    location.label.includes(dosi as string)
                  )
                    .sort((a, b) => (a.label > b.label ? 1 : -1))
                    .map((lo) => {
                      return {
                        value: lo.label.replace(dosi as string, "").trim(),
                        label: lo.label.replace(dosi as string, "").trim(),
                      };
                    })}
                  instanceId={id2}
                  components={{
                    ValueContainer,
                    DropdownIndicator,
                    IndicatorSeparator: null,
                  }}
                  styles={colourStyles}
                  placeholder="시/군/구 선택"
                  onChange={(selectedOption: any) => {
                    onGuDongSelect(selectedOption);
                    formik.setFieldValue("location2", selectedOption.value);
                  }}
                />
              </div>
            </div>

            <div className="divider">
              <label className="label">통증 부위</label>
              <ButtonWrapper>
                {Symtoms.map((symtom, i) =>
                  symtom.selected ? (
                    <Button
                      key={i}
                      text={symtom.title}
                      backgroundColor={theme.colors.white}
                      color={theme.colors.purple}
                      border={`0.1rem solid ${theme.colors.purple}`}
                      onClick={() => onSymtomClick(symtom, formik)}
                    />
                  ) : (
                    <Button
                      key={i}
                      text={symtom.title}
                      backgroundColor={theme.colors.white}
                      color={theme.colors.grey}
                      border={`0.1rem solid ${theme.colors.grey}`}
                      onClick={() => onSymtomClick(symtom, formik)}
                    />
                  )
                )}
              </ButtonWrapper>
            </div>
            <div className="save-button-wrapper">
              <Button text="도수리 시작하기" width="100%" />
            </div>
          </div>
        </form>
      </FormikProvider>
    </FormWrapper>
  );
};

export default RegisterForm;

const FormWrapper = styled.div`
  margin-top: 2rem;

  .divider {
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &.nickname {
      position: relative;
      margin-bottom: 3.5rem;
    }
  }

  .noti {
    position: absolute;
    bottom: -2.5rem;
    font-size: ${(props) => props.theme.fontSizes.md};
    line-height: ${(props) => props.theme.lineHeights.md};

    & .valid {
      color: ${(props) => props.theme.colors.purple};
    }
    & .invalid {
      color: ${(props) => props.theme.colors.red};
    }
    & .invisible {
      visibility: hidden;
    }
  }

  .form-section {
    display: flex;
    flex-direction: column;
  }

  .input-section {
    display: flex;
    gap: 2rem;

    &.phone {
      gap: 1rem;
    }
  }

  .sex-section {
    display: flex;
    gap: 2.5rem;
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg} label {
      display: flex;
      align-items: center;
    }

    label {
      display: flex;
      align-items: center;
    }

    input[type="radio"] {
      height: 1.8em;
      width: 1.8rem;
      margin: 0 1rem 0 0;
      accent-color: ${(props) => props.theme.colors.purple};
      &:checked {
        accent-color: ${(props) => props.theme.colors.purple};
      }
      &:checked::after {
        accent-color: ${(props) => props.theme.colors.purple};
      }
    }
  }

  .select-section {
    display: flex;
    gap: 2rem;
    flex-grow: 1;
  }

  .label {
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg};
    font-weight: 700;
    color: ${(props) => props.theme.colors.purple};
  }

  .field {
    height: 4.2rem;
    border-radius: 0.5rem;
    border: 0.1rem solid ${(props) => props.theme.colors.grey};
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg};
    flex-grow: 1;
    padding: 1rem;

    &::placeholder {
      color: ${(props) => props.theme.colors.grey};
    }
  }

  .phone-prefix {
    height: 4.2rem;
    border-radius: 0.5rem;
    border: 0.1rem solid ${(props) => props.theme.colors.grey};
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg};
    padding: 1rem 0.5rem;
  }

  .save-button-wrapper {
    padding: 1rem 0;
    width: 100%;
  }

  .is-invalid {
    border: 1px solid red;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  & button {
    flex: 1 0 auto;
    max-width: 6rem;
  }
`;
