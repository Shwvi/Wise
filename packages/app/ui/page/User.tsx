import {
  Avatar,
  Breadcrumbs,
  Chip,
  emphasize,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { uploadUserImg } from "@/api/request";
import { useRecoilValue, useSetRecoilState } from "recoil";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { SetUserState } from "../state/core/user";
import { LoadingButton } from "@mui/lab";
import { DocNodeSelectState, usePopPathStack } from "../state/core";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
    "& span": {
      cursor: "pointer",
    },
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
const Input = styled("input")({
  display: "none",
});
export function UserPage() {
  const userInfo = useRecoilValue(SetUserState);
  const setUser = useSetRecoilState(SetUserState);
  const [loading, setLoading] = useState(false);
  const selectNodeId = useRecoilValue(DocNodeSelectState);
  const { pop } = usePopPathStack();
  const upload = useCallback(
    async (file: File) => {
      setLoading(true);
      const form = new FormData();
      form.append("file", file as any);
      const avaurl = await uploadUserImg(form);
      if (avaurl) {
        setUser((u) =>
          u
            ? {
                ...u,
                props: {
                  ...u?.props,
                  avatar: avaurl,
                },
              }
            : null
        );
      }
      setLoading(false);
    },
    [setUser]
  );
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = event.target.files?.[0];
      if (newFile) upload(newFile);
    },
    [upload]
  );
  return (
    <div className="w-full h-full p-4">
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          onClick={() => {
            pop(selectNodeId);
          }}
          component="a"
          href="#"
          label="Home"
          icon={<HomeIcon fontSize="small" />}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="User"
          icon={<PersonIcon />}
        />
      </Breadcrumbs>
      <Paper elevation={3} className="p-5 mt-4">
        <Typography variant="h5">User Setting</Typography>
        <Stack spacing={3} direction="row" className="items-center mt-3">
          <Avatar
            alt={userInfo?.username}
            src={`file://assets/${userInfo?.props.avatar}`}
            variant="square"
            sx={{
              width: 56,
              height: 56,
            }}
          />

          <label htmlFor="contained-button-file">
            <Input
              onChange={onChange}
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
            />
            <LoadingButton
              variant="contained"
              component="span"
              size="small"
              startIcon={<FileUploadIcon />}
              loading={loading}
            >
              Upload
            </LoadingButton>
          </label>
        </Stack>
      </Paper>
    </div>
  );
}
