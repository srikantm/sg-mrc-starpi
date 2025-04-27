import {Alert, AlertTitle, AlertColor} from '@mui/material';

interface AlertProps {
  title?: string;
  description?: string;
  severity?: AlertColor;
  showTitle?: boolean;
}

export default ({title, ...props}: AlertProps) => {
  return (
    <Alert severity={props.severity ?? 'error'}>
      <AlertTitle>{props.showTitle ? title : 'Error'}</AlertTitle>
      {props.description ?? (
        <>
          This Component is not implemented yet, contact the{' '}
          <strong>Developers</strong>
        </>
      )}
    </Alert>
  );
};
