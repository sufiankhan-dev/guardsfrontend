import React,{useState} from "react";
import Icon from "@/components/ui/Icon";
import { useParams } from "react-router-dom";

const statistics = [
  {
   
    icon: "heroicons:arrow-trending-up",
  
  },
  {
   
    icon: "heroicons:arrow-trending-up",
    
  },
  {
   
    icon: "heroicons:arrow-trending-down",
    
  },
  {
   
    
    icon: "heroicons:arrow-trending-up",
    
  },
];

const GroupChart4 = ({ statistics , setselectedData , setselectedDatas }) => {

  const [selected,Setselected] = useState('')
  const { id } = useParams();



  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg}  rounded-md p-4 text-center `}
          onClick={() => {
            setselectedData([item])
          //  setselectedDatas([item])
            Setselected(item)
            } }
          
          style={{ backgroundColor:   item.bg }}
        >
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-white mb-4">
            {/* Assuming item.icon is a valid icon name */}
            <Icon icon={item.icon} className="text-2xl" />
          </div>
          <span className="block text-sm text-slate-600 font-medium dark:text-white mb-1 uppercase font-semibold ">
            {item.title}
          </span>
         

        
          <div>
          <div className="text-[14px] text-slate-900 dark:text-white font-medium ">
            {Object.entries(item.count).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
          </div>
            <div className="pt-3">
                  {
                
                selected.title === item.title ?
                (
                  <div className="p-2 mx-auto flex items-center justify-center rounded-full bg-white mb-4">
                    <button>Active</button>
                  </div>
                ) : null
              }
            </div>

        </div>
      ))}
    </>
  );
};




export default GroupChart4;
