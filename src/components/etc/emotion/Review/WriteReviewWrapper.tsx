import styled from "@emotion/styled";

export const WriteReviewWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .container {
    margin-bottom: 1rem;
  }

  .title-layout {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text-limit {
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: ${(props) => props.theme.fontSizes.md};
    line-height: ${(props) => props.theme.lineHeights.md};
    color: ${(props) => props.theme.colors.grey};
    margin-top: 0.5rem;
  }

  .input-small {
    .field {
      width: 12rem;
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

    &[comma-value] {
      position: relative;
      overflow: hidden;
    }

    &[comma-value]:before {
      content: attr(comma-value);
      font-size: ${(props) => props.theme.fontSizes.lg};
      line-height: ${(props) => props.theme.lineHeights.lg};
      position: absolute;
      top: 1.2rem;
      left: 0.8rem;
    }

    .treatment-price {
      color: #fff;
    }
  }

  .input-large {
    .field {
      width: 100%;
      min-height: 16rem;
      border-radius: 1rem;
      border: 0.1rem solid ${(props) => props.theme.colors.grey};
      font-size: ${(props) => props.theme.fontSizes.lg};
      line-height: ${(props) => props.theme.lineHeights.lg};
      flex-grow: 1;
      padding: 1rem;
      resize: none;

      &::placeholder {
        color: ${(props) => props.theme.colors.grey};
      }
    }
  }

  .input-box {
    width: 100%;
    min-height: 4.2rem;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    border: 0.1rem solid ${(props) => props.theme.colors.grey};
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg};
    flex-grow: 1;
    padding: 1rem;
    cursor: pointer;

    &.clicked {
      color: black;
    }
  }

  .upload-image {
    cursor: pointer;
  }

  .banner-layout {
    display: flex;
    align-items: center;
    margin-top: -0.5rem;
    margin-right: 1.5rem;
    margin-bottom: 1rem;
  }

  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(152, 143, 255, 0.3);
    border-radius: 2rem;
    flex-grow: 1;
    padding: 0.5rem 1rem;
    gap: 0.5rem;

    &-text {
      font-size: ${(props) => props.theme.fontSizes.md};
      line-height: ${(props) => props.theme.lineHeights.md};

      .highlight {
        color: ${(props) => props.theme.colors.purple};
      }
    }
  }

  .question {
    font-size: ${(props) => props.theme.fontSizes.lg};
    line-height: ${(props) => props.theme.lineHeights.lg};
  }

  .bill-example {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    margin: 1rem 0 1.5rem;
  }

  .input-form-layout {
    display: flex;
    align-items: bottom;
    gap: 1rem;
    margin-top: 1rem;

    .unit {
      display: flex;
      align-items: center;
      font-size: ${(props) => props.theme.fontSizes.lg};
      line-height: ${(props) => props.theme.lineHeights.lg};
      font-weight: 700;
    }
  }
`;
