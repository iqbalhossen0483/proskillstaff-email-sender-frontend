import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  templateId: number;
  onDuplicate: () => void;
  onSend: () => void;
  onDeleted: () => void;
};

const TemplateMenus = ({
  onDeleted,
  onDuplicate,
  onSend,
  templateId,
}: Props) => {
  const router = useRouter();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 -mr-1 -mt-1"
            />
          }
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/templates/${templateId}/edit`)}
          >
            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSend}>
            <Send className="h-3.5 w-3.5 mr-2" /> Send
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDeleted}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TemplateMenus;
