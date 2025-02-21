import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface ProgressDialogProps {
    visible: boolean;
    progress : number;
}

const ProgressDialog = ({visible, progress} : ProgressDialogProps) => {
  return (
    <Dialog open={visible}>
        <DialogClose disabled={true} />
  <DialogContent className="min-h-[50vh] max-h-[50vh] max-w-[50vh] flex w-full h-full justify-center items-center">
    <div className="h-4/5 w-4/5 rounded-[100px] border-8 border-rose-600 flex justify-center items-center">
    <DialogTitle className="text-center w-full font-bold text-3xl text-white">{progress}%</DialogTitle>
    </div>
    <DialogDescription></DialogDescription>
  </DialogContent>
</Dialog>

  )
}

export default ProgressDialog