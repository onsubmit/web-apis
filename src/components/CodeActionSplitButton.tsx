import DescriptionIcon from '@mui/icons-material/Description';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

export type CodeAction = 'Copy';

const codeActionContent = ['Snippet', 'Document'] as const;
export type CodeActionContent = (typeof codeActionContent)[number];

export type CodeActionFn = (
  action: CodeAction,
  code: CodeActionContent
) => void;
type CodeActionSplitButtonProps = {
  actionIcon: React.ReactNode;
  snippetIcon: React.ReactNode;
  action: CodeAction;
  onCodeAction: CodeActionFn;
};

export default function CodeActionSplitButton({
  actionIcon,
  snippetIcon,
  action,
  onCodeAction,
}: CodeActionSplitButtonProps) {
  const contentIconMap: Record<CodeActionContent, React.ReactNode> = {
    Snippet: snippetIcon,
    Document: <DescriptionIcon />,
  };

  return (
    <Dropdown>
      <MenuButton
        aria-label={action}
        title={action}
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'soft', color: 'neutral' } }}
      >
        {actionIcon}
      </MenuButton>
      <Menu>
        {codeActionContent.map((content, i) => (
          <MenuItem
            key={i}
            onClick={(
              (c) => () =>
                onCodeAction(action, c)
            )(content)}
          >
            <ListItemDecorator>{contentIconMap[content]}</ListItemDecorator>{' '}
            {content}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}
